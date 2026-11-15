/**
 * AssignmentPro Student Dashboard Page
 * Overview of assignments, metrics, quick start actions, and recent activity.
 */

const DashboardPage = {
  async render() {
    const user = window.appState.get("user") || {};
    
    // Fetch stats & recent assignments
    let stats = {
      total_assignments: 0,
      total_words: 0,
      avg_words: 0,
      format_distribution: {},
      recent_assignments: []
    };

    try {
      stats = await window.api.getDashboardStats();
      window.appState.set("dashboardStats", stats);
    } catch (err) {
      console.warn("Failed to load dashboard stats:", err);
    }

    const recent = stats.recent_assignments || [];

    return `
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        <!-- Welcome Hero Banner -->
        <div class="relative overflow-hidden bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
          <!-- Background decorative shapes -->
          <div class="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-blue-500/10 blur-2xl pointer-events-none"></div>
          <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div class="space-y-2">
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-700/60 text-blue-200 text-xs font-semibold border border-blue-600/40">
                <i data-lucide="sparkles" class="w-3.5 h-3.5 text-blue-300"></i>
                <span>College Academic Workspace</span>
              </div>
              <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Welcome, ${user.full_name || "Scholar"}!
              </h1>
              <p class="text-blue-100 text-sm max-w-xl">
                ${user.college_name ? `Affiliated with <b>${user.college_name}</b>` : "Ready to create your next assignment with precise academic formatting and genuine citations."}
                ${user.department ? ` &bull; ${user.department}` : ''}
              </p>
            </div>

            <div class="flex items-center gap-3">
              <button onclick="router.navigate('create')" class="px-5 py-3 bg-white text-blue-900 hover:bg-blue-50 font-bold text-sm rounded-xl shadow-lg transition-all flex items-center gap-2">
                <i data-lucide="plus-circle" class="w-4 h-4 text-blue-600"></i>
                <span>Create Assignment</span>
              </button>
              <button onclick="router.navigate('guidelines')" class="px-4 py-3 bg-blue-700/80 hover:bg-blue-700 text-white font-medium text-sm rounded-xl border border-blue-500/40 transition-all flex items-center gap-2">
                <i data-lucide="file-up" class="w-4 h-4"></i>
                <span>Upload Guidelines</span>
              </button>
            </div>
          </div>
        </div>

        <!-- 4 Metric Cards -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Assignments</span>
              <div class="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <i data-lucide="file-text" class="w-4 h-4"></i>
              </div>
            </div>
            <div class="text-2xl sm:text-3xl font-extrabold text-slate-900">${stats.total_assignments}</div>
            <div class="text-[11px] text-slate-400">Total generated to date</div>
          </div>

          <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Words Written</span>
              <div class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <i data-lucide="pen-tool" class="w-4 h-4"></i>
              </div>
            </div>
            <div class="text-2xl sm:text-3xl font-extrabold text-slate-900">${stats.total_words.toLocaleString()}</div>
            <div class="text-[11px] text-emerald-600 font-medium">Avg ~${stats.avg_words.toLocaleString()} words/doc</div>
          </div>

          <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pages Formatted</span>
              <div class="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <i data-lucide="book-open" class="w-4 h-4"></i>
              </div>
            </div>
            <div class="text-2xl sm:text-3xl font-extrabold text-slate-900">${Math.max(1, Math.round(stats.total_words / 275))}</div>
            <div class="text-[11px] text-slate-400">A4 standard academic pages</div>
          </div>

          <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Referencing</span>
              <div class="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <i data-lucide="check-check" class="w-4 h-4"></i>
              </div>
            </div>
            <div class="text-2xl sm:text-3xl font-extrabold text-slate-900">${user.preferred_citation || "APA 7th"}</div>
            <div class="text-[11px] text-slate-400">Primary citation style</div>
          </div>
        </div>

        <!-- Quick Launch Panels -->
        <div class="grid md:grid-cols-3 gap-6">
          <div onclick="router.navigate('create')" class="p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group">
            <div class="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <i data-lucide="plus" class="w-5 h-5"></i>
            </div>
            <h3 class="font-bold text-slate-900 mb-1 text-base">New Assignment Wizard</h3>
            <p class="text-xs text-slate-500">Step-by-step form with college requirements, word count, margins, and format selection.</p>
          </div>

          <div onclick="router.navigate('guidelines')" class="p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group">
            <div class="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center mb-4 group-hover:bg-sky-600 group-hover:text-white transition-colors">
              <i data-lucide="file-check-2" class="w-5 h-5"></i>
            </div>
            <h3 class="font-bold text-slate-900 mb-1 text-base">Guideline Inspector</h3>
            <p class="text-xs text-slate-500">Upload assignment PDF or rubric to auto-detect target pages, word count, and required sections.</p>
          </div>

          <div onclick="router.navigate('profile')" class="p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group">
            <div class="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <i data-lucide="sliders" class="w-5 h-5"></i>
            </div>
            <h3 class="font-bold text-slate-900 mb-1 text-base">College Formats & Presets</h3>
            <p class="text-xs text-slate-500">Save your university guidelines once so you never have to re-enter headers or font rules.</p>
          </div>
        </div>

        <!-- Recent Assignments Table -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div class="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 class="text-lg font-bold text-slate-900">Recent Assignments</h2>
              <p class="text-xs text-slate-500">Access, edit, preview, and download your academic papers.</p>
            </div>
            <button onclick="router.navigate('my_assignments')" class="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 self-start sm:self-auto">
              <span>View All Assignments</span>
              <i data-lucide="chevron-right" class="w-4 h-4"></i>
            </button>
          </div>

          ${recent.length === 0 ? `
            <div class="p-12 text-center space-y-4">
              <div class="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <i data-lucide="file-text" class="w-6 h-6"></i>
              </div>
              <div class="space-y-1">
                <h4 class="font-bold text-slate-800 text-sm">No assignments generated yet</h4>
                <p class="text-xs text-slate-500">Create your first assignment in seconds with our step-by-step generator.</p>
              </div>
              <button onclick="router.navigate('create')" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors">
                + Create First Assignment
              </button>
            </div>
          ` : `
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs">
                <thead class="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th class="py-3 px-6">Assignment Title & Topic</th>
                    <th class="py-3 px-4">Subject</th>
                    <th class="py-3 px-4">Format</th>
                    <th class="py-3 px-4">Length</th>
                    <th class="py-3 px-4">Referencing</th>
                    <th class="py-3 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 text-slate-700">
                  ${recent.map(a => `
                    <tr class="hover:bg-slate-50/80 transition-colors">
                      <td class="py-4 px-6 max-w-xs">
                        <div class="font-bold text-slate-900 truncate hover:text-blue-600 cursor-pointer" onclick="window.appActions.openEditor(${a.id})">
                          ${a.title}
                        </div>
                        <div class="text-[11px] text-slate-400 truncate mt-0.5">${a.topic}</div>
                      </td>
                      <td class="py-4 px-4 font-medium">${a.subject}</td>
                      <td class="py-4 px-4">
                        <span class="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                          ${a.format_type}
                        </span>
                      </td>
                      <td class="py-4 px-4 font-mono text-[11px]">
                        ${a.actual_words.toLocaleString()}w &bull; ${a.estimated_pages}p
                      </td>
                      <td class="py-4 px-4 text-slate-500 font-medium">
                        ${a.citation_style}
                      </td>
                      <td class="py-4 px-6 text-right space-x-1.5 whitespace-nowrap">
                        <button onclick="window.appActions.openEditor(${a.id})" class="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 font-medium transition-colors" title="Edit Content">
                          <i data-lucide="edit-2" class="w-3.5 h-3.5 inline"></i> Edit
                        </button>
                        <button onclick="window.appActions.openPreview(${a.id})" class="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors" title="View A4 Preview">
                          <i data-lucide="eye" class="w-3.5 h-3.5 inline"></i>
                        </button>
                        <button onclick="window.api.triggerDownload(${a.id}, 'docx')" class="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium transition-colors" title="Download Word (.docx)">
                          <i data-lucide="file-down" class="w-3.5 h-3.5 inline"></i> DOCX
                        </button>
                        <button onclick="window.api.triggerDownload(${a.id}, 'pdf')" class="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-medium transition-colors" title="Download PDF (.pdf)">
                          <i data-lucide="download" class="w-3.5 h-3.5 inline"></i> PDF
                        </button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          `}
        </div>

      </div>
    `;
  }
};

window.DashboardPage = DashboardPage;
