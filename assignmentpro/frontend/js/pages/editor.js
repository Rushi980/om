/**
 * AssignmentPro Assignment Editor Page
 * Full section-by-section document editor with AI assistive tools, reordering, and live word counter.
 */

const EditorPage = {
  assignment: null,
  activeSectionId: null,
  isAutoSaving: false,
  saveTimeout: null,

  async render(params = {}) {
    let assignment = window.appState.get("activeAssignment");
    const id = params.id;

    if (!assignment || (id && assignment.id != id)) {
      try {
        assignment = await window.api.getAssignment(id);
        window.appState.set("activeAssignment", assignment);
      } catch (err) {
        UI.showToast("Could not load assignment: " + err.message, "error");
        router.navigate("dashboard");
        return `<div>Loading...</div>`;
      }
    }

    this.assignment = assignment;
    const sections = assignment.sections || [];
    if (!this.activeSectionId && sections.length > 0) {
      this.activeSectionId = sections[0].id;
    }

    const activeSec = sections.find(s => s.id === this.activeSectionId) || sections[0] || {};
    const words = assignment.actual_words || 0;
    const pages = assignment.estimated_pages || 1;

    return `
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        <!-- Editor Top Header & Toolbar -->
        <div class="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="space-y-1 min-w-0 flex-1">
            <div class="flex items-center gap-2">
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                ${assignment.format_type}
              </span>
              <span id="save-status-indicator" class="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                <i data-lucide="check" class="w-3.5 h-3.5 text-emerald-500"></i> All changes auto-saved
              </span>
            </div>
            <input type="text" id="editor-doc-title" value="${assignment.title}" oninput="EditorPage.handleDocTitleChange(this.value)" class="text-lg sm:text-xl font-bold text-slate-900 border-none bg-transparent hover:bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 rounded-lg p-1 w-full truncate" />
            <div class="text-xs text-slate-500 truncate">
              Subject: <b>${assignment.subject}</b> &bull; Topic: ${assignment.topic} &bull; ${assignment.citation_style}
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center gap-2.5 flex-wrap">
            <!-- Word count badge -->
            <div class="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700">
              <span id="doc-words-counter" class="font-bold text-blue-600">${words.toLocaleString()}</span> words
              <span class="text-slate-400">(${pages}p)</span>
            </div>

            <button onclick="router.navigate('preview', { id: ${assignment.id} })" class="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5">
              <i data-lucide="eye" class="w-3.5 h-3.5"></i>
              <span>A4 Preview</span>
            </button>

            <button onclick="window.api.triggerDownload(${assignment.id}, 'docx')" class="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5">
              <i data-lucide="file-down" class="w-3.5 h-3.5"></i>
              <span>DOCX</span>
            </button>

            <button onclick="window.api.triggerDownload(${assignment.id}, 'pdf')" class="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all flex items-center gap-1.5">
              <i data-lucide="download" class="w-3.5 h-3.5"></i>
              <span>Download PDF</span>
            </button>
          </div>
        </div>

        <!-- 2-Column Editor Layout -->
        <div class="grid lg:grid-cols-12 gap-6">
          
          <!-- Left Column: Document Outline / Table of Contents -->
          <div class="lg:col-span-4 space-y-4">
            <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div class="flex items-center justify-between pb-2 border-b border-slate-100">
                <span class="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <i data-lucide="list" class="w-4 h-4 text-blue-600"></i>
                  <span>Sections Outline</span>
                </span>
                <button onclick="EditorPage.addNewSection()" class="text-xs text-blue-600 font-semibold hover:text-blue-800 flex items-center gap-1">
                  <i data-lucide="plus" class="w-3.5 h-3.5"></i> Add
                </button>
              </div>

              <!-- Section Item List -->
              <div class="space-y-1.5" id="sections-outline-list">
                ${sections.map((sec, idx) => `
                  <div onclick="EditorPage.selectSection('${sec.id}')" class="group flex items-center justify-between p-2.5 rounded-xl text-xs cursor-pointer transition-all ${sec.id === this.activeSectionId ? 'bg-blue-50 text-blue-900 font-semibold border border-blue-200 shadow-sm' : 'hover:bg-slate-50 text-slate-700 border border-transparent'}">
                    <div class="flex items-center gap-2 truncate">
                      <span class="w-5 h-5 rounded-full ${sec.id === this.activeSectionId ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'} flex items-center justify-center text-[10px] flex-shrink-0">
                        ${idx + 1}
                      </span>
                      <span class="truncate">${sec.title}</span>
                    </div>

                    <!-- Order Actions -->
                    <div class="opacity-0 group-hover:opacity-100 flex items-center gap-1">
                      <button onclick="event.stopPropagation(); EditorPage.moveSection(${idx}, -1)" class="p-1 hover:text-blue-600" title="Move Up">
                        <i data-lucide="chevron-up" class="w-3.5 h-3.5"></i>
                      </button>
                      <button onclick="event.stopPropagation(); EditorPage.moveSection(${idx}, 1)" class="p-1 hover:text-blue-600" title="Move Down">
                        <i data-lucide="chevron-down" class="w-3.5 h-3.5"></i>
                      </button>
                      <button onclick="event.stopPropagation(); EditorPage.deleteSection('${sec.id}')" class="p-1 hover:text-rose-600" title="Delete Section">
                        <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                      </button>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Authentic References Box -->
            <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div class="flex items-center justify-between pb-2 border-b border-slate-100">
                <span class="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <i data-lucide="bookmark" class="w-4 h-4 text-emerald-600"></i>
                  <span>Bibliography (${(assignment.references || []).length})</span>
                </span>
                <span class="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  ${assignment.citation_style}
                </span>
              </div>
              <div class="space-y-2 text-[11px] text-slate-600 max-h-56 overflow-y-auto">
                ${(assignment.references || []).map((r, i) => `
                  <div class="p-2 rounded-lg bg-slate-50 border border-slate-100 leading-relaxed">
                    <span class="font-bold text-slate-800">[${i+1}]</span> ${r.citation || str(r)}
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- Right Column: Active Section Editor -->
          <div class="lg:col-span-8 space-y-5">
            <div class="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-sm space-y-5">
              
              <!-- Section Title Header & Controls -->
              <div class="space-y-1 pb-4 border-b border-slate-100">
                <div class="flex items-center justify-between">
                  <label class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Section Heading</label>
                  <span class="text-[11px] text-slate-400 font-mono" id="sec-word-count">
                    ${(activeSec.content ? activeSec.content.split(/\s+/).length : 0)} words
                  </span>
                </div>
                <input type="text" id="active-sec-title" value="${activeSec.title || ''}" oninput="EditorPage.handleSectionTitleChange(this.value)" class="w-full text-base sm:text-lg font-bold text-blue-900 border-none bg-slate-50 hover:bg-slate-100/80 focus:bg-white focus:ring-2 focus:ring-blue-500/20 rounded-xl px-3 py-2" />
              </div>

              <!-- AI Assistive Palette Toolbar -->
              <div class="p-3 rounded-xl bg-gradient-to-r from-blue-50/80 to-indigo-50/60 border border-blue-100 flex flex-wrap items-center gap-2">
                <span class="text-[11px] font-bold text-blue-900 flex items-center gap-1 mr-1">
                  <i data-lucide="sparkles" class="w-3.5 h-3.5 text-blue-600"></i> AI Assist:
                </span>
                
                <button onclick="EditorPage.triggerAiAssist('expand')" class="px-2.5 py-1 text-xs font-semibold bg-white hover:bg-blue-600 hover:text-white text-slate-700 rounded-lg border border-slate-200 shadow-sm transition-all flex items-center gap-1">
                  <i data-lucide="plus" class="w-3 h-3 text-blue-600"></i> Expand (+200w)
                </button>

                <button onclick="EditorPage.triggerAiAssist('shorten')" class="px-2.5 py-1 text-xs font-semibold bg-white hover:bg-blue-600 hover:text-white text-slate-700 rounded-lg border border-slate-200 shadow-sm transition-all flex items-center gap-1">
                  <i data-lucide="minimize-2" class="w-3 h-3 text-blue-600"></i> Condense
                </button>

                <button onclick="EditorPage.triggerAiAssist('formal')" class="px-2.5 py-1 text-xs font-semibold bg-white hover:bg-blue-600 hover:text-white text-slate-700 rounded-lg border border-slate-200 shadow-sm transition-all flex items-center gap-1">
                  <i data-lucide="graduation-cap" class="w-3 h-3 text-indigo-600"></i> Formal Tone
                </button>

                <button onclick="EditorPage.triggerAiAssist('grammar')" class="px-2.5 py-1 text-xs font-semibold bg-white hover:bg-blue-600 hover:text-white text-slate-700 rounded-lg border border-slate-200 shadow-sm transition-all flex items-center gap-1">
                  <i data-lucide="check-circle" class="w-3 h-3 text-emerald-600"></i> Fix Grammar
                </button>

                <button onclick="EditorPage.triggerAiAssist('table')" class="px-2.5 py-1 text-xs font-semibold bg-white hover:bg-blue-600 hover:text-white text-slate-700 rounded-lg border border-slate-200 shadow-sm transition-all flex items-center gap-1">
                  <i data-lucide="table" class="w-3 h-3 text-purple-600"></i> Insert Table
                </button>

                <button onclick="EditorPage.openCustomAiPromptModal()" class="px-2.5 py-1 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition-all flex items-center gap-1">
                  <i data-lucide="wand-2" class="w-3 h-3"></i> Custom Prompt
                </button>
              </div>

              <!-- Main Textarea -->
              <div class="space-y-2">
                <textarea id="active-sec-content" rows="14" oninput="EditorPage.handleContentChange(this.value)" class="w-full p-4 text-xs sm:text-sm font-academic leading-relaxed rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:outline-none transition-colors">${activeSec.content || ''}</textarea>
              </div>

              <!-- Section Tables View (If any) -->
              ${(activeSec.tables && activeSec.tables.length > 0) ? `
                <div class="pt-4 border-t border-slate-100 space-y-3">
                  <div class="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <i data-lucide="table" class="w-4 h-4 text-blue-600"></i>
                    <span>Tabulated Data & Empirical Matrices</span>
                  </div>
                  ${activeSec.tables.map(tbl => `
                    <div class="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                      <div class="bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 border-b border-slate-200">
                        ${tbl.caption}
                      </div>
                      <div class="overflow-x-auto">
                        <table class="w-full text-left text-[11px]">
                          <thead class="bg-blue-900 text-white font-semibold">
                            <tr>
                              ${tbl.headers.map(h => `<th class="p-2">${h}</th>`).join('')}
                            </tr>
                          </thead>
                          <tbody class="divide-y divide-slate-100 text-slate-700">
                            ${tbl.rows.map(r => `
                              <tr class="hover:bg-slate-50">
                                ${r.map(v => `<td class="p-2">${v}</td>`).join('')}
                              </tr>
                            `).join('')}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  `).join('')}
                </div>
              ` : ''}

            </div>
          </div>

        </div>

      </div>
    `;
  },

  selectSection(secId) {
    this.activeSectionId = secId;
    router.render();
  },

  handleSectionTitleChange(val) {
    const sec = (this.assignment.sections || []).find(s => s.id === this.activeSectionId);
    if (sec) {
      sec.title = val;
      this.scheduleAutoSave();
    }
  },

  handleContentChange(val) {
    const sec = (this.assignment.sections || []).find(s => s.id === this.activeSectionId);
    if (sec) {
      sec.content = val;
      const count = val.trim() ? val.trim().split(/\s+/).length : 0;
      const secWordDisplay = document.getElementById("sec-word-count");
      if (secWordDisplay) secWordDisplay.textContent = `${count} words`;
      this.recalculateTotalMetrics();
      this.scheduleAutoSave();
    }
  },

  handleDocTitleChange(val) {
    this.assignment.title = val;
    this.scheduleAutoSave();
  },

  recalculateTotalMetrics() {
    let total = 0;
    (this.assignment.sections || []).forEach(s => {
      total += (s.content ? s.content.trim().split(/\s+/).length : 0);
    });
    this.assignment.actual_words = total;
    this.assignment.estimated_pages = Math.max(1, Math.round(total / 275));
    const counter = document.getElementById("doc-words-counter");
    if (counter) counter.textContent = total.toLocaleString();
  },

  scheduleAutoSave() {
    const status = document.getElementById("save-status-indicator");
    if (status) {
      status.innerHTML = `<span class="inline-block animate-spin mr-1">&#9696;</span> Saving draft...`;
    }

    clearTimeout(this.saveTimeout);
    this.saveTimeout = setTimeout(async () => {
      try {
        await window.api.updateAssignment(this.assignment.id, {
          title: this.assignment.title,
          sections: this.assignment.sections,
          cover_page: this.assignment.cover_page,
          references: this.assignment.references,
          change_summary: "Editor draft updated"
        });
        if (status) {
          status.innerHTML = `<i data-lucide="check" class="w-3.5 h-3.5 text-emerald-500 inline mr-1"></i> All changes auto-saved`;
          if (window.lucide) window.lucide.createIcons();
        }
      } catch (err) {
        if (status) {
          status.innerHTML = `<span class="text-rose-500 font-medium">Failed to save draft</span>`;
        }
      }
    }, 1200);
  },

  addNewSection() {
    const count = (this.assignment.sections || []).length;
    const newSec = {
      id: `sec_${count + 1}_${Date.now()}`,
      title: `${count + 1}.0 Additional Analytical Section`,
      level: 1,
      content: "This section explores subsequent academic observations, contextualizing experimental findings within the overarching thesis.",
      order: count + 1,
      tables: []
    };
    this.assignment.sections.push(newSec);
    this.activeSectionId = newSec.id;
    this.recalculateTotalMetrics();
    this.scheduleAutoSave();
    router.render();
    UI.showToast("New section added!", "success");
  },

  deleteSection(secId) {
    if (this.assignment.sections.length <= 1) {
      UI.showToast("Assignment must have at least one section.", "error");
      return;
    }
    this.assignment.sections = this.assignment.sections.filter(s => s.id !== secId);
    if (this.activeSectionId === secId) {
      this.activeSectionId = this.assignment.sections[0].id;
    }
    this.recalculateTotalMetrics();
    this.scheduleAutoSave();
    router.render();
    UI.showToast("Section removed.", "info");
  },

  moveSection(index, direction) {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= this.assignment.sections.length) return;
    const temp = this.assignment.sections[index];
    this.assignment.sections[index] = this.assignment.sections[targetIdx];
    this.assignment.sections[targetIdx] = temp;
    this.scheduleAutoSave();
    router.render();
  },

  async triggerAiAssist(instruction) {
    const sec = (this.assignment.sections || []).find(s => s.id === this.activeSectionId);
    if (!sec) return;

    UI.showToast(`Applying AI assist: ${instruction}...`, "info");
    try {
      const res = await window.api.regenerateSection(this.assignment.id, {
        section_id: sec.id,
        section_title: sec.title,
        current_content: sec.content,
        instruction: instruction,
        assignment_topic: this.assignment.topic,
        citation_style: this.assignment.citation_style
      });

      sec.content = res.content;
      const textarea = document.getElementById("active-sec-content");
      if (textarea) textarea.value = res.content;
      this.recalculateTotalMetrics();
      this.scheduleAutoSave();
      UI.showToast(res.summary, "success");
    } catch (err) {
      UI.showToast("AI Assist failed: " + err.message, "error");
    }
  },

  openCustomAiPromptModal() {
    UI.openModal(
      "AI Prompt Assistant for Active Section",
      `
        <div class="space-y-3">
          <p class="text-xs text-slate-500">Provide specific custom guidance to rewrite or enhance this section.</p>
          <textarea id="custom-ai-prompt-input" rows="4" placeholder="e.g. Add 2 real-world industry case studies; simplify technical equations; provide counter-arguments..." class="w-full p-3 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500/20"></textarea>
        </div>
      `,
      `
        <button onclick="UI.closeModal()" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg">Cancel</button>
        <button onclick="EditorPage.submitCustomAiPrompt()" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg">Execute AI Prompt</button>
      `
    );
  },

  submitCustomAiPrompt() {
    const promptInput = document.getElementById("custom-ai-prompt-input");
    const val = promptInput ? promptInput.value.trim() : "";
    UI.closeModal();
    if (val) {
      this.triggerAiAssist(val);
    }
  }
};

window.EditorPage = EditorPage;
