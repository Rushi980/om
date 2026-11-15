/**
 * AssignmentPro API Client
 * Centralized fetch handler for all REST endpoints with JWT authorization.
 */

const API_BASE = "";

class ApiClient {
  constructor() {
    this.token = localStorage.getItem("assignmentpro_token") || null;
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem("assignmentpro_token", token);
    } else {
      localStorage.removeItem("assignmentpro_token");
    }
  }

  getToken() {
    return this.token || localStorage.getItem("assignmentpro_token");
  }

  async request(endpoint, options = {}) {
    const headers = {
      ...(options.headers || {})
    };

    const token = this.getToken();
    if (token && !headers["Authorization"]) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    if (!(options.body instanceof FormData) && !headers["Content-Type"]) {
      headers["Content-Type"] = "application/json";
    }

    const config = {
      ...options,
      headers
    };

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, config);
      
      // Handle Unauthorized
      if (response.status === 401 && !endpoint.includes("/auth/login") && !endpoint.includes("/auth/register")) {
        this.setToken(null);
        window.dispatchEvent(new CustomEvent("auth:unauthorized"));
        throw new Error("Session expired. Please log in again.");
      }

      // Handle file downloads
      if (response.headers.get("content-disposition")) {
        return response;
      }

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const errorMsg = data.detail || (typeof data === "string" ? data : "Request failed");
        throw new Error(errorMsg);
      }

      return data;
    } catch (err) {
      console.error(`[API Error: ${endpoint}]`, err);
      throw err;
    }
  }

  // --- Auth ---
  async login(email, password) {
    const data = await this.request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password })
    });
    this.setToken(data.access_token);
    return data;
  }

  async register(payload) {
    const data = await this.request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(payload)
    });
    this.setToken(data.access_token);
    return data;
  }

  async getMe() {
    return this.request("/api/auth/me");
  }

  async updateProfile(profileData) {
    return this.request("/api/auth/profile", {
      method: "PUT",
      body: JSON.stringify(profileData)
    });
  }

  logout() {
    this.setToken(null);
  }

  // --- College Profiles ---
  async getProfiles() {
    return this.request("/api/profiles");
  }

  async createProfile(payload) {
    return this.request("/api/profiles", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  }

  async deleteProfile(profileId) {
    return this.request(`/api/profiles/${profileId}`, {
      method: "DELETE"
    });
  }

  // --- Templates ---
  async getTemplates() {
    return this.request("/api/templates");
  }

  // --- Guidelines Upload & Parsing ---
  async uploadGuidelines(file) {
    const formData = new FormData();
    formData.append("file", file);
    return this.request("/api/guidelines/upload", {
      method: "POST",
      body: formData
    });
  }

  async parseGuidelinesText(rawText) {
    return this.request("/api/guidelines/parse-text", {
      method: "POST",
      body: JSON.stringify({ raw_text: rawText })
    });
  }

  // --- Assignments ---
  async getAssignments(search = "", formatType = "") {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (formatType) params.append("format_type", formatType);
    return this.request(`/api/assignments?${params.toString()}`);
  }

  async getAssignment(id) {
    return this.request(`/api/assignments/${id}`);
  }

  async generateAssignment(payload) {
    return this.request("/api/assignments/generate", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  }

  async updateAssignment(id, payload) {
    return this.request(`/api/assignments/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload)
    });
  }

  async regenerateSection(assignmentId, payload) {
    return this.request(`/api/assignments/${assignmentId}/regenerate-section`, {
      method: "POST",
      body: JSON.stringify(payload)
    });
  }

  async duplicateAssignment(id) {
    return this.request(`/api/assignments/${id}/duplicate`, {
      method: "POST"
    });
  }

  async deleteAssignment(id) {
    return this.request(`/api/assignments/${id}`, {
      method: "DELETE"
    });
  }

  // --- Exports ---
  getExportUrl(id, format) {
    const token = this.getToken();
    return `/api/assignments/${id}/export/${format}`;
  }

  async triggerDownload(id, format, filename) {
    const token = this.getToken();
    const res = await fetch(`/api/assignments/${id}/export/${format}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Download failed");
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename || `AssignmentPro_${id}.${format}`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }

  // --- Dashboard & Admin ---
  async getDashboardStats() {
    return this.request("/api/dashboard/stats");
  }

  async getAdminStats() {
    return this.request("/api/admin/stats");
  }

  async getAdminUsers() {
    return this.request("/api/admin/users");
  }

  async getAdminSettings() {
    return this.request("/api/admin/settings");
  }

  async updateAdminSettings(settings) {
    return this.request("/api/admin/settings", {
      method: "PUT",
      body: JSON.stringify({ settings })
    });
  }
}

window.api = new ApiClient();
