/**
 * AssignmentPro Upload Guidelines Inspector Page
 * Standalone tool to upload and inspect college syllabi, rubrics, and guidelines.
 */

const GuidelinesPage = {
  parsedResult: null,
  rawText: "",
  filename: "",

  render() {
    return `
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        <!-- Header -->
        <div class="text-center space-y-2">
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
            <i data-lucide="file-search" class="w-3.5 h-3.5"></i>
            <span>AI Guideline Understanding Engine</span>
          </div>
          <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">College Guidelines Inspector</h1>
          <p class="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
            Upload your college rubric or assignment PDF. Our parser automatically extracts page length, word counts, mandatory headings, and citation rules.
          </p>
        </div>

        <!-- Upload & Input Card -->
        <div class="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          
          <!-- Dropzone -->
          <div id="inspector-dropzone" ondragover="GuidelinesPage.handleDragOver(event)" ondragleave="GuidelinesPage.handleDragLeave(event)" ondrop="GuidelinesPage.handleDrop(event)" class="border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50/60 p-8 rounded-2xl text-center transition-all cursor-pointer" onclick="document.getElementById('inspector-file-input').click()">
            <input type="file" id="inspector-file-input" accept=".pdf,.docx,.txt" class="hidden" onchange="GuidelinesPage.handleFileSelected(event)" />
            <div class="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-3 shadow-sm">
              <i data-lucide="upload-cloud" class="w-6 h-6"></i>
            </div>
            <div class="text-sm font-bold text-slate-800">
              Drop college guidelines document here or click to browse
            </div>
            <div class="text-xs text-slate-400 mt-1">Accepts PDF, DOCX, or TXT up to 25MB</div>
          </div>

          <div class="relative flex py-1 items-center">
            <div class="flex-grow border-t border-slate-200"></div>
            <span class="flex-shrink mx-4 text-xs font-semibold text-slate-400 uppercase">Or Paste Syllabus Text</span>
            <div class="flex-grow border-t border-slate-200"></div>
          </div>

          <!-- Paste Raw Text Option -->
          <div class="space-y-2">
            <textarea id="inspector-textarea" rows="4" placeholder="Paste assignment guidelines or syllabus instructions directly here (e.g. '1500 words, APA 7th style, Times New Roman font, double spaced, must include Methodology and Analysis')..." class="w-full p-3.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600">${this.rawText}</textarea>
            <div class="flex justify-end">
              <button onclick="GuidelinesPage.parsePastedText()" class="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all flex items-center gap-1.5">
                <i data-lucide="cpu" class="w-3.5 h-3.5"></i>
                <span>Analyze Text with AI</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Parsed Results Card (Shown when parsedResult exists) -->
        ${this.parsedResult ? `
          <div class="bg-white p-6 sm:p-8 rounded-2xl border border-blue-200 shadow-md space-y-6">
            <div class="flex items-center justify-between pb-4 border-b border-slate-100">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <i data-lucide="check" class="w-4 h-4"></i>
                </div>
                <div>
                  <h3 class="font-bold text-slate-900 text-sm sm:text-base">Guideline Intelligence Insights</h3>
                  <div class="text-[11px] text-slate-400">${this.filename || 'Pasted text input'}</div>
                </div>
              </div>

              <button onclick="GuidelinesPage.createAssignmentWithRules()" class="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5">
                <span>Start Assignment with These Rules</span>
                <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
              </button>
            </div>

            <!-- Detected Parameters Grid -->
            <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div class="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div class="text-[10px] text-slate-400 uppercase font-semibold">Detected Word Count</div>
                <div class="text-lg font-bold text-blue-900 mt-1">
                  ${this.parsedResult.detected_word_count ? `${this.parsedResult.detected_word_count.toLocaleString()} words` : 'Unspecified (Default 1,500)'}
                </div>
              </div>

              <div class="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div class="text-[10px] text-slate-400 uppercase font-semibold">Detected Pages</div>
                <div class="text-lg font-bold text-blue-900 mt-1">
                  ${this.parsedResult.detected_pages ? `${this.parsedResult.detected_pages} pages` : 'Approx. 5-6 pages'}
                </div>
              </div>

              <div class="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div class="text-[10px] text-slate-400 uppercase font-semibold">Citation Style</div>
                <div class="text-lg font-bold text-blue-900 mt-1">
                  ${this.parsedResult.detected_citation || 'APA 7th (Standard)'}
                </div>
              </div>

              <div class="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div class="text-[10px] text-slate-400 uppercase font-semibold">Font / Spacing</div>
                <div class="text-lg font-bold text-blue-900 mt-1">
                  ${this.parsedResult.detected_font || 'Times New Roman'} ${this.parsedResult.detected_spacing ? `(${this.parsedResult.detected_spacing}x)` : ''}
                </div>
              </div>
            </div>

            <!-- Mandatory Headings Identified -->
            ${this.parsedResult.mandatory_sections && this.parsedResult.mandatory_sections.length > 0 ? `
              <div class="space-y-2">
                <div class="text-xs font-bold text-slate-800 uppercase tracking-wider">Identified Mandatory Sections</div>
                <div class="flex flex-wrap gap-2">
                  ${this.parsedResult.mandatory_sections.map(sec => `
                    <span class="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200 flex items-center gap-1">
                      <i data-lucide="check" class="w-3 h-3 text-blue-600"></i>
                      ${sec}
                    </span>
                  `).join('')}
                </div>
              </div>
            ` : ''}

            <!-- Summary Text -->
            <div class="p-4 rounded-xl bg-blue-50/60 border border-blue-100 text-xs text-blue-900">
              <b>Synthesis Summary:</b> ${this.parsedResult.summary}
            </div>

          </div>
        ` : ''}

      </div>
    `;
  },

  handleDragOver(e) {
    e.preventDefault();
    document.getElementById("inspector-dropzone").classList.add("border-blue-500", "bg-blue-50");
  },

  handleDragLeave(e) {
    e.preventDefault();
    document.getElementById("inspector-dropzone").classList.remove("border-blue-500", "bg-blue-50");
  },

  handleDrop(e) {
    e.preventDefault();
    document.getElementById("inspector-dropzone").classList.remove("border-blue-500", "bg-blue-50");
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      this.uploadFile(e.dataTransfer.files[0]);
    }
  },

  handleFileSelected(e) {
    if (e.target.files && e.target.files.length > 0) {
      this.uploadFile(e.target.files[0]);
    }
  },

  async uploadFile(file) {
    UI.showToast(`Uploading '${file.name}'...`, "info");
    this.filename = file.name;
    try {
      const res = await window.api.uploadGuidelines(file);
      this.parsedResult = res.insights;
      this.rawText = res.extracted_text;
      router.render();
      UI.showToast("Guidelines analyzed successfully!", "success");
    } catch (err) {
      UI.showToast("Analysis failed: " + err.message, "error");
    }
  },

  async parsePastedText() {
    const text = document.getElementById("inspector-textarea").value.trim();
    if (!text) {
      UI.showToast("Please enter or paste guideline instructions.", "error");
      return;
    }
    this.rawText = text;
    this.filename = "Pasted Guidelines Text";
    try {
      const res = await window.api.parseGuidelinesText(text);
      this.parsedResult = res.insights;
      router.render();
      UI.showToast("Guidelines analyzed!", "success");
    } catch (err) {
      UI.showToast("Analysis failed: " + err.message, "error");
    }
  },

  createAssignmentWithRules() {
    // Forward parsed rules to Create wizard
    if (this.parsedResult.detected_word_count) {
      CreatePage.formData.target_words = this.parsedResult.detected_word_count;
      CreatePage.formData.target_pages = Math.max(1, Math.round(this.parsedResult.detected_word_count / 275));
    }
    if (this.parsedResult.detected_citation) {
      CreatePage.formData.citation_style = this.parsedResult.detected_citation;
    }
    if (this.parsedResult.detected_font) {
      CreatePage.formData.font_style = this.parsedResult.detected_font;
    }
    if (this.parsedResult.detected_spacing) {
      CreatePage.formData.line_spacing = this.parsedResult.detected_spacing;
    }
    if (this.rawText) {
      CreatePage.formData.guidelines_text = this.rawText;
    }
    CreatePage.formData.guidelines_filename = this.filename;

    router.navigate("create");
    UI.showToast("Imported guidelines into new assignment wizard!", "success");
  }
};

window.GuidelinesPage = GuidelinesPage;
