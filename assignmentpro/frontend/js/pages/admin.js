/**
 * AssignmentPro Admin Dashboard Page
 * System metrics, user accounts management, templates, and platform settings.
 */

const AdminPage = {
  stats: null,
  users: [],
  templates: [],
  settings: {},

  async render() {
    const user = window.appState.get("user");
    if (!user || user.role !== "admin") {
      return `
        <div class="max-w-md mx-auto py-20 text-center space-y-4">
          <div class="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
            <i data-lucide="shield-alert" class="w-6 h-6"></i>
          </div>
          <h2 class="text-xl font-bold text-slate-900">Access Denied</h2>
          <p class="text-xs text-slate-500">You must be logged in as an Administrator to view this console.</p>
          <button onclick="window.appActions.loginDemoAdmin()" class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-xl">
            Switch to Demo Admin
          </button>
        </div>
      `;
    }

    try {
      const [s, u, t, st] = await Promise.all([
        window.api.getAdminStats(),
        window.api.getAdminUsers(),
        window.api.getTemplates(),
        window.api.getAdminSettings()
      ]);
      this.stats = s;
      this.users = u;
      this.templates = t;
      this.settings = st;
    } catch (err) {
      console.warn("Failed to load admin data:", err);
    }

    return `
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold border border-purple-200">
              <i data-lucide="shield-check" class="w-3.5 h-3.5"></i>
              <span>Platform Administration Console</span>
            </div>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">Admin Dashboard</h1>
            <p class="text-xs sm:text-sm text-slate-500">Monitor system usage, registered scholars, and platform configuration.</p>
          </div>

          <div class="flex items-center gap-2">
            <button onclick="router.render()" class="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5">
              <i data-lucide="refresh-cw" class="w-3.5 h-3.5"></i>
              <span>Refresh Stats</span>
            </button>
          </div>
        </div>

        <!-- Metric Cards -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <span class="text-xs font-semibold text-slate-500 uppercase">Registered Users</span>
            <div class="text-2xl sm:text-3xl font-extrabold text-slate-900">${this.stats?.total_users || 0}</div>
            <div class="text-[11px] text-slate-400">Total active accounts</div>
          </div>

          <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <span class="text-xs font-semibold text-slate-500 uppercase">Total Assignments</span>
            <div class="text-2xl sm:text-3xl font-extrabold text-purple-700">${this.stats?.total_assignments || 0}</div>
            <div class="text-[11px] text-slate-400">Generated across all users</div>
          </div>

          <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <span class="text-xs font-semibold text-slate-500 uppercase">Words Synthesized</span>
            <div class="text-2xl sm:text-3xl font-extrabold text-emerald-600">${(this.stats?.total_words_generated || 0).toLocaleString()}</div>
            <div class="text-[11px] text-slate-400">Total academic output</div>
          </div>

          <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <span class="text-xs font-semibold text-slate-500 uppercase">Active Templates</span>
            <div class="text-2xl sm:text-3xl font-extrabold text-blue-600">${this.stats?.total_templates || 7}</div>
            <div class="text-[11px] text-slate-400">Standard formats ready</div>
          </div>
        </div>

        <!-- User Accounts Management Table -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-0">
          <div class="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 class="text-base font-bold text-slate-900">User Accounts Management</h2>
              <p class="text-xs text-slate-500">List of all registered students, professors, and administrators.</p>
            </div>
            <span class="text-xs font-semibold px-2.5 py-1 bg-slate-100 rounded-full text-slate-700">
              ${this.users.length} Users
            </span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50 text-slate-500 uppercase text-[10px] font-semibold tracking-wider border-b border-slate-100">
                <tr>
                  <th class="py-3 px-6">User & Email</th>
                  <th class="py-3 px-4">Affiliated College</th>
                  <th class="py-3 px-4">Role</th>
                  <th class="py-3 px-4">Assignments Created</th>
                  <th class="py-3 px-6 text-right">Joined Date</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 text-slate-700">
                ${this.users.map(u => `
                  <tr class="hover:bg-slate-50">
                    <td class="py-3.5 px-6">
                      <div class="font-bold text-slate-900">${u.full_name}</div>
                      <div class="text-[11px] text-slate-400 font-mono">${u.email}</div>
                    </td>
                    <td class="py-3.5 px-4 font-medium">${u.college_name || "—"}</td>
                    <td class="py-3.5 px-4">
                      <span class="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${u.role === 'admin' ? 'bg-purple-100 text-purple-700 border border-purple-200' : 'bg-blue-50 text-blue-700 border border-blue-200'}">
                        ${u.role}
                      </span>
                    </td>
                    <td class="py-3.5 px-4 font-bold text-slate-900 font-mono">
                      ${u.assignment_count || 0}
                    </td>
                    <td class="py-3.5 px-6 text-right text-slate-400 text-[11px]">
                      ${u.created_at ? u.created_at.slice(0, 10) : "Recent"}
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Templates & Format Catalog -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div class="border-b border-slate-100 pb-3">
            <h2 class="text-base font-bold text-slate-900">Academic Templates & Blueprints</h2>
            <p class="text-xs text-slate-500">System templates available for student generation.</p>
          </div>

          <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            ${this.templates.map(t => `
              <div class="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div class="flex items-center justify-between">
                  <span class="font-bold text-slate-900 text-xs">${t.name}</span>
                  <span class="text-[10px] font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">${t.citation_style}</span>
                </div>
                <p class="text-[11px] text-slate-500 leading-relaxed">${t.description}</p>
                <div class="text-[10px] text-slate-400 font-mono pt-1">
                  Blueprint: ${(t.structure || []).length} sections defined
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Platform Settings Form -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div class="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h2 class="text-base font-bold text-slate-900">Platform Settings & AI Configuration</h2>
              <p class="text-xs text-slate-500">Control system-wide generative parameters and feature gates.</p>
            </div>
            <button onclick="AdminPage.saveSettings()" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl">
              Save Platform Settings
            </button>
          </div>

          <div class="grid sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Default AI Engine Provider</label>
              <input type="text" id="setting-ai-provider" value="${this.settings?.ai_provider || 'Built-in High-Rigor Academic Engine'}" class="w-full p-2.5 rounded-xl border border-slate-300" />
            </div>

            <div>
              <label class="block font-semibold text-slate-700 mb-1">Max Words Limit Per Assignment</label>
              <input type="number" id="setting-max-words" value="${this.settings?.max_word_limit || 15000}" class="w-full p-2.5 rounded-xl border border-slate-300" />
            </div>

            <div class="sm:col-span-2">
              <label class="block font-semibold text-slate-700 mb-1">System Announcement Banner</label>
              <input type="text" id="setting-announcement" value="${this.settings?.system_announcement || ''}" class="w-full p-2.5 rounded-xl border border-slate-300" />
            </div>
          </div>
        </div>

      </div>
    `;
  },

  async saveSettings() {
    const provider = document.getElementById("setting-ai-provider").value;
    const maxWords = document.getElementById("setting-max-words").value;
    const announcement = document.getElementById("setting-announcement").value;

    try {
      await window.api.updateAdminSettings({
        ai_provider: provider,
        max_word_limit: maxWords,
        system_announcement: announcement
      });
      UI.showToast("Platform settings updated!", "success");
    } catch (err) {
      UI.showToast("Failed to update settings: " + err.message, "error");
    }
  }
};

window.AdminPage = AdminPage;
