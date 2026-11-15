/**
 * AssignmentPro Main Application Controller & Router
 */

class AppRouter {
  constructor() {
    this.routes = {
      landing: window.LandingPage,
      auth: window.AuthPage,
      dashboard: window.DashboardPage,
      create: window.CreatePage,
      guidelines: window.GuidelinesPage,
      generating: window.GeneratingPage,
      editor: window.EditorPage,
      preview: window.PreviewPage,
      my_assignments: window.MyAssignmentsPage,
      profile: window.ProfilePage,
      admin: window.AdminPage
    };
    this.currentParams = {};
  }

  async navigate(pageName, params = {}) {
    const user = window.appState.get("user");
    
    // Auth Guards
    const protectedPages = ["dashboard", "create", "guidelines", "generating", "editor", "preview", "my_assignments", "profile", "admin"];
    if (protectedPages.includes(pageName) && !user) {
      window.appState.set("currentPage", "auth");
      this.currentParams = { mode: "login", redirect: pageName };
      this.render();
      return;
    }

    if (pageName === "admin" && user && user.role !== "admin") {
      UI.showToast("Admin privileges required.", "error");
      pageName = "dashboard";
    }

    window.appState.set("currentPage", pageName);
    this.currentParams = params;
    await this.render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async render() {
    const pageName = window.appState.get("currentPage") || "landing";
    const pageModule = this.routes[pageName] || window.LandingPage;
    const contentContainer = document.getElementById("app-content");

    if (!contentContainer) return;

    // Render navbar first
    UI.renderNavbar();

    // Render page content (handling async render)
    try {
      const renderedHtml = await pageModule.render(this.currentParams);
      contentContainer.innerHTML = renderedHtml;
      if (window.lucide) window.lucide.createIcons();
    } catch (err) {
      console.error("[Render Error]", err);
      contentContainer.innerHTML = `
        <div class="max-w-md mx-auto py-16 text-center space-y-4">
          <div class="text-rose-600 font-bold text-lg">Error loading page</div>
          <p class="text-xs text-slate-500">${err.message}</p>
          <button onclick="router.navigate('dashboard')" class="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold">
            Return to Dashboard
          </button>
        </div>
      `;
    }
  }
}

window.router = new AppRouter();

// Global App Actions Helper
window.appActions = {
  async loginDemoStudent() {
    UI.showToast("Authenticating demo student account (Alex Chen)...", "info");
    try {
      const res = await window.api.login("student@assignmentpro.edu", "StudentPassword2026!");
      window.appState.set("user", res.user);
      window.appState.set("isAuthenticated", true);
      UI.showToast("Signed in as Alex Chen (Student)!", "success");
      router.navigate("dashboard");
    } catch (err) {
      UI.showToast("Login failed: " + err.message, "error");
    }
  },

  async loginDemoAdmin() {
    UI.showToast("Authenticating demo administrator (Prof. Vance)...", "info");
    try {
      const res = await window.api.login("admin@assignmentpro.edu", "AdminPassword2026!");
      window.appState.set("user", res.user);
      window.appState.set("isAuthenticated", true);
      UI.showToast("Signed in as Prof. Eleanor Vance (Admin)!", "success");
      router.navigate("admin");
    } catch (err) {
      UI.showToast("Login failed: " + err.message, "error");
    }
  },

  logout() {
    window.api.logout();
    window.appState.set("user", null);
    window.appState.set("isAuthenticated", false);
    UI.showToast("Signed out successfully.", "info");
    router.navigate("landing");
  },

  openEditor(id) {
    router.navigate("editor", { id });
  },

  openPreview(id) {
    router.navigate("preview", { id });
  }
};

// Initial App Bootstrap
document.addEventListener("DOMContentLoaded", async () => {
  // Listen for unauthorized session drop
  window.addEventListener("auth:unauthorized", () => {
    window.appState.set("user", null);
    window.appState.set("isAuthenticated", false);
    router.navigate("auth", { mode: "login" });
  });

  // Verify existing token if present
  const token = window.api.getToken();
  if (token) {
    try {
      const user = await window.api.getMe();
      window.appState.set("user", user);
      window.appState.set("isAuthenticated", true);
      router.navigate("dashboard");
      return;
    } catch (err) {
      window.api.logout();
    }
  }

  // Otherwise render public landing
  router.navigate("landing");
});
