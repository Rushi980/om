/**
 * AssignmentPro User Profile & Saved College Formats Page
 */

const ProfilePage = {
  profiles: [],

  async render() {
    const user = window.appState.get("user") || {};

    try {
      this.profiles = await window.api.getProfiles();
      window.appState.set("profiles", this.profiles);
    } catch (e) {
      this.profiles = [];
    }

    return `
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        <div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Student Profile & Settings</h1>
          <p class="text-xs sm:text-sm text-slate-500">Manage your academic credentials, saved college templates, and AI preferences.</p>
        </div>

        <div class="grid md:grid-cols-12 gap-8">
          
          <!-- Left Column: Personal Academic Info -->
          <div class="md:col-span-7 space-y-6">
            <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div class="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div class="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                  ${user.full_name ? user.full_name.slice(0, 2).toUpperCase() : "ST"}
                </div>
                <div>
                  <h3 class="font-bold text-slate-900 text-sm sm:text-base">${user.full_name}</h3>
                  <div class="text-xs text-slate-400">${user.email} &bull; <span class="capitalize">${user.role}</span></div>
                </div>
              </div>

              <form onsubmit="ProfilePage.handleSaveProfile(event)" class="space-y-4 text-xs">
                <div>
                  <label class="block font-semibold text-slate-700 mb-1">Full Name</label>
                  <input type="text" id="prof-fullname" value="${user.full_name || ''}" class="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500/20" />
                </div>

                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block font-semibold text-slate-700 mb-1">College Name</label>
                    <input type="text" id="prof-college" value="${user.college_name || ''}" class="w-full px-3 py-2 rounded-xl border border-slate-300" />
                  </div>
                  <div>
                    <label class="block font-semibold text-slate-700 mb-1">University Name</label>
                    <input type="text" id="prof-university" value="${user.university_name || ''}" class="w-full px-3 py-2 rounded-xl border border-slate-300" />
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block font-semibold text-slate-700 mb-1">Department</label>
                    <input type="text" id="prof-dept" value="${user.department || ''}" class="w-full px-3 py-2 rounded-xl border border-slate-300" />
                  </div>
                  <div>
                    <label class="block font-semibold text-slate-700 mb-1">Course / Program</label>
                    <input type="text" id="prof-course" value="${user.course || ''}" class="w-full px-3 py-2 rounded-xl border border-slate-300" />
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block font-semibold text-slate-700 mb-1">Student Roll No / ID</label>
                    <input type="text" id="prof-studentid" value="${user.student_id || ''}" class="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono" />
                  </div>
                  <div>
                    <label class="block font-semibold text-slate-700 mb-1">Preferred Referencing</label>
                    <select id="prof-citation" class="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white">
                      <option value="APA 7th" ${user.preferred_citation === 'APA 7th' ? 'selected' : ''}>APA 7th Edition</option>
                      <option value="IEEE" ${user.preferred_citation === 'IEEE' ? 'selected' : ''}>IEEE Standard</option>
                      <option value="MLA 9th" ${user.preferred_citation === 'MLA 9th' ? 'selected' : ''}>MLA 9th Edition</option>
                      <option value="Harvard" ${user.preferred_citation === 'Harvard' ? 'selected' : ''}>Harvard Style</option>
                      <option value="Chicago" ${user.preferred_citation === 'Chicago' ? 'selected' : ''}>Chicago Style</option>
                    </select>
                  </div>
                </div>

                <div class="pt-2">
                  <button type="submit" class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-sm transition-all">
                    Save Profile Changes
                  </button>
                </div>
              </form>
            </div>
          </div>

          <!-- Right Column: Saved College Presets -->
          <div class="md:col-span-5 space-y-6">
            <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div class="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 class="font-bold text-slate-900 text-sm">Saved College Formats</h3>
                  <div class="text-[11px] text-slate-400">Reusable institution setups</div>
                </div>
                <button onclick="ProfilePage.openAddPresetModal()" class="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1">
                  <i data-lucide="plus" class="w-3.5 h-3.5"></i> Add
                </button>
              </div>

              ${this.profiles.length === 0 ? `
                <div class="text-center py-6 text-xs text-slate-400">
                  No custom presets saved. Save your university guidelines to auto-fill future assignments.
                </div>
              ` : `
                <div class="space-y-3">
                  ${this.profiles.map(p => `
                    <div class="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5 text-xs">
                      <div class="flex items-center justify-between font-bold text-slate-900">
                        <span>${p.profile_name}</span>
                        <button onclick="ProfilePage.deletePreset(${p.id})" class="text-slate-400 hover:text-rose-600 p-1">
                          <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                        </button>
                      </div>
                      <div class="text-[11px] text-slate-500">${p.college_name}</div>
                      <div class="text-[10px] text-blue-600 font-mono">${p.default_font} &bull; ${p.default_line_spacing}x spacing &bull; ${p.default_citation}</div>
                    </div>
                  `).join('')}
                </div>
              `}
            </div>

            <!-- AI Engine & Provider Status -->
            <div class="bg-slate-900 text-white p-6 rounded-2xl space-y-3 shadow-md">
              <div class="flex items-center justify-between text-xs text-blue-300 font-semibold uppercase tracking-wider">
                <span>AI Synthesis Engine</span>
                <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
              </div>
              <p class="text-xs text-slate-300 leading-relaxed">
                AssignmentPro runs our <b>High-Rigor Academic Engine</b> locally with authentic landmark literature and exact word calibration.
              </p>
              <div class="pt-2 text-[11px] text-slate-400 border-t border-slate-800 flex items-center justify-between">
                <span>External APIs: Gemini / OpenAI</span>
                <span class="text-emerald-400 font-mono">Operational</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    `;
  },

  async handleSaveProfile(event) {
    event.preventDefault();
    const payload = {
      full_name: document.getElementById("prof-fullname").value.trim(),
      college_name: document.getElementById("prof-college").value.trim(),
      university_name: document.getElementById("prof-university").value.trim(),
      department: document.getElementById("prof-dept").value.trim(),
      course: document.getElementById("prof-course").value.trim(),
      student_id: document.getElementById("prof-studentid").value.trim(),
      preferred_citation: document.getElementById("prof-citation").value
    };

    try {
      const updated = await window.api.updateProfile(payload);
      window.appState.set("user", updated);
      UI.showToast("Profile details updated successfully!", "success");
      UI.renderNavbar();
    } catch (err) {
      UI.showToast("Failed to update profile: " + err.message, "error");
    }
  },

  openAddPresetModal() {
    UI.openModal(
      "Add Saved College Format Preset",
      `
        <div class="space-y-3 text-xs">
          <div>
            <label class="block font-semibold text-slate-700 mb-1">Preset Label</label>
            <input type="text" id="preset-label" placeholder="e.g. Stanford CS Dept Guidelines" class="w-full p-2.5 rounded-lg border border-slate-300" />
          </div>
          <div>
            <label class="block font-semibold text-slate-700 mb-1">College Name</label>
            <input type="text" id="preset-college" placeholder="Stanford School of Engineering" class="w-full p-2.5 rounded-lg border border-slate-300" />
          </div>
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Font Family</label>
              <select id="preset-font" class="w-full p-2 rounded-lg border border-slate-300">
                <option value="Times New Roman">Times New Roman</option>
                <option value="Calibri">Calibri</option>
                <option value="Arial">Arial</option>
              </select>
            </div>
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Referencing</label>
              <select id="preset-citation" class="w-full p-2 rounded-lg border border-slate-300">
                <option value="APA 7th">APA 7th</option>
                <option value="IEEE">IEEE</option>
                <option value="MLA 9th">MLA 9th</option>
                <option value="Harvard">Harvard</option>
              </select>
            </div>
          </div>
        </div>
      `,
      `
        <button onclick="UI.closeModal()" class="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg">Cancel</button>
        <button onclick="ProfilePage.savePreset()" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg">Save Preset</button>
      `
    );
  },

  async savePreset() {
    const label = document.getElementById("preset-label").value.trim();
    const college = document.getElementById("preset-college").value.trim();
    const font = document.getElementById("preset-font").value;
    const citation = document.getElementById("preset-citation").value;

    if (!label || !college) {
      UI.showToast("Please provide label and college name.", "error");
      return;
    }

    UI.closeModal();
    try {
      await window.api.createProfile({
        profile_name: label,
        college_name: college,
        default_font: font,
        default_citation: citation,
        default_line_spacing: 1.5
      });
      UI.showToast("College format preset saved!", "success");
      router.render();
    } catch (err) {
      UI.showToast("Failed to save preset: " + err.message, "error");
    }
  },

  async deletePreset(id) {
    try {
      await window.api.deleteProfile(id);
      UI.showToast("Preset removed.", "info");
      router.render();
    } catch (err) {
      UI.showToast("Delete failed: " + err.message, "error");
    }
  }
};

window.ProfilePage = ProfilePage;
