/**
 * AssignmentPro My Assignments Page
 * Library of past assignments with instant search, format filters, duplicate, and export tools.
 */

const MyAssignmentsPage = {
  searchQuery: "",
  selectedFormat: "All",
  assignments: [],

  async render() {
    try {
      this.assignments = await window.api.getAssignments(this.searchQuery, this.selectedFormat);
      window.appState.set("assignments", this.assignments);
    } catch (err) {
      console.warn("Failed to load assignments:", err);
      this.assignments = [];
    }

    return `
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        <!-- Header & Action -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">My Assignments</h1>
            <p class="text-xs sm:text-sm text-slate-500">Manage, edit, duplicate, and download your academic papers.</p>
          </div>
          <button onclick="router.navigate('create')" class="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-sm shadow-blue-500/20 transition-all flex items-center gap-2 self-start sm:self-auto">
            <i data-lucide="plus" class="w-4 h-4"></i>
            <span>Create New Assignment</span>
          </button>
        </div>

        <!-- Filter & Search Toolbar -->
        <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          <div class="relative w-full md:w-80">
            <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute left-3.5 top-3"></i>
            <input type="text" id="assignment-search-input" value="${this.searchQuery}" oninput="MyAssignmentsPage.handleSearch(this.value)" placeholder="Search by topic, title, subject..." class="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600" />
          </div>

          <div class="flex items-center gap-2 w-full md:w-auto">
            <span class="text-xs text-slate-500 font-medium whitespace-nowrap">Format:</span>
            <select onchange="MyAssignmentsPage.handleFormatFilter(this.value)" class="text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-blue-500/20">
              <option value="All" ${this.selectedFormat === 'All' ? 'selected' : ''}>All Formats</option>
              <option value="Standard college assignment" ${this.selectedFormat === 'Standard college assignment' ? 'selected' : ''}>Standard College</option>
              <option value="Technical assignment" ${this.selectedFormat === 'Technical assignment' ? 'selected' : ''}>Technical & Engineering</option>
              <option value="Research-based assignment" ${this.selectedFormat === 'Research-based assignment' ? 'selected' : ''}>Research Paper</option>
              <option value="Case study" ${this.selectedFormat === 'Case study' ? 'selected' : ''}>Case Study</option>
              <option value="Practical assignment" ${this.selectedFormat === 'Practical assignment' ? 'selected' : ''}>Practical Lab</option>
              <option value="Project documentation" ${this.selectedFormat === 'Project documentation' ? 'selected' : ''}>Project Documentation</option>
            </select>
          </div>
        </div>

        <!-- Assignments Grid -->
        ${this.assignments.length === 0 ? `
          <div class="bg-white p-16 rounded-2xl border border-slate-200 text-center space-y-4">
            <div class="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-sm">
              <i data-lucide="file-question" class="w-7 h-7"></i>
            </div>
            <div class="space-y-1">
              <h3 class="font-bold text-slate-900 text-base">No assignments match your filter</h3>
              <p class="text-xs text-slate-500 max-w-sm mx-auto">Try clearing your search query or generate a new assignment now.</p>
            </div>
            <button onclick="router.navigate('create')" class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl">
              + Generate Assignment
            </button>
          </div>
        ` : `
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${this.assignments.map(a => `
              <div class="bg-white rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all p-5 flex flex-col justify-between space-y-4">
                <div class="space-y-2.5">
                  <div class="flex items-center justify-between">
                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                      ${a.format_type}
                    </span>
                    <span class="text-[10px] text-slate-400 font-mono">
                      ${a.actual_words.toLocaleString()}w &bull; ${a.estimated_pages}p
                    </span>
                  </div>

                  <h3 class="font-bold text-slate-900 text-sm line-clamp-2 hover:text-blue-600 cursor-pointer" onclick="window.appActions.openEditor(${a.id})">
                    ${a.title}
                  </h3>

                  <div class="space-y-1 text-xs text-slate-500">
                    <div><b>Subject:</b> ${a.subject}</div>
                    <div class="line-clamp-1"><b>Topic:</b> ${a.topic}</div>
                    <div class="text-[11px] text-slate-400"><b>Citation:</b> ${a.citation_style} &bull; ${a.font_style}</div>
                  </div>
                </div>

                <div class="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div class="flex items-center gap-1.5">
                    <button onclick="window.appActions.openEditor(${a.id})" class="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold transition-colors flex items-center gap-1">
                      <i data-lucide="edit-3" class="w-3.5 h-3.5"></i> Edit
                    </button>
                    <button onclick="window.appActions.openPreview(${a.id})" class="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600" title="A4 Preview">
                      <i data-lucide="eye" class="w-4 h-4"></i>
                    </button>
                    <button onclick="MyAssignmentsPage.duplicate(${a.id})" class="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600" title="Duplicate Assignment">
                      <i data-lucide="copy" class="w-4 h-4"></i>
                    </button>
                  </div>

                  <div class="flex items-center gap-1">
                    <button onclick="window.api.triggerDownload(${a.id}, 'docx')" class="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600" title="Download Word (.docx)">
                      <i data-lucide="file-down" class="w-4 h-4"></i>
                    </button>
                    <button onclick="window.api.triggerDownload(${a.id}, 'pdf')" class="p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-600" title="Download PDF (.pdf)">
                      <i data-lucide="download" class="w-4 h-4"></i>
                    </button>
                    <button onclick="MyAssignmentsPage.deleteConfirm(${a.id})" class="p-1.5 rounded-lg hover:bg-rose-50 text-rose-500" title="Delete">
                      <i data-lucide="trash-2" class="w-4 h-4"></i>
                    </button>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        `}

      </div>
    `;
  },

  searchDebounce: null,
  handleSearch(query) {
    this.searchQuery = query;
    clearTimeout(this.searchDebounce);
    this.searchDebounce = setTimeout(() => {
      router.render();
    }, 350);
  },

  handleFormatFilter(fmt) {
    this.selectedFormat = fmt;
    router.render();
  },

  async duplicate(id) {
    UI.showToast("Duplicating assignment...", "info");
    try {
      await window.api.duplicateAssignment(id);
      UI.showToast("Assignment duplicated!", "success");
      router.render();
    } catch (err) {
      UI.showToast("Duplicate failed: " + err.message, "error");
    }
  },

  deleteConfirm(id) {
    UI.openModal(
      "Confirm Assignment Deletion",
      `
        <div class="space-y-2">
          <p class="text-xs text-slate-600">Are you sure you want to permanently delete this assignment? This action cannot be undone.</p>
        </div>
      `,
      `
        <button onclick="UI.closeModal()" class="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg">Cancel</button>
        <button onclick="MyAssignmentsPage.executeDelete(${id})" class="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg">Delete Permanently</button>
      `
    );
  },

  async executeDelete(id) {
    UI.closeModal();
    try {
      await window.api.deleteAssignment(id);
      UI.showToast("Assignment deleted.", "info");
      router.render();
    } catch (err) {
      UI.showToast("Delete failed: " + err.message, "error");
    }
  }
};

window.MyAssignmentsPage = MyAssignmentsPage;
