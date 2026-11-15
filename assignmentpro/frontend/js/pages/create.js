/**
 * AssignmentPro Create Assignment Page (4-Step Wizard)
 * Comprehensive college requirements form with guideline upload and format selection.
 */

const CreatePage = {
  currentStep: 1,
  formData: {
    college_name: "",
    university_name: "",
    department: "",
    course: "",
    semester: "Semester VI",
    academic_year: "2026-2027",
    instructor_name: "",
    student_roll_no: "",
    subject: "",
    topic: "",
    title: "",
    target_pages: 5,
    target_words: 1500,
    font_style: "Times New Roman",
    font_size: 12,
    line_spacing: 1.5,
    page_margins: "1 inch (2.54 cm)",
    citation_style: "APA 7th",
    deadline: "",
    format_type: "Standard college assignment",
    template_id: null,
    guidelines_text: "",
    guidelines_filename: ""
  },

  async render() {
    const user = window.appState.get("user") || {};
    
    // Pre-populate with user defaults if empty
    if (!this.formData.college_name && user.college_name) {
      this.formData.college_name = user.college_name;
      this.formData.university_name = user.university_name || "";
      this.formData.department = user.department || "";
      this.formData.course = user.course || "";
      this.formData.student_roll_no = user.student_id || "";
      this.formData.citation_style = user.preferred_citation || "APA 7th";
    }

    // Fetch user profiles for quick selector
    let profiles = [];
    try {
      profiles = await window.api.getProfiles();
      window.appState.set("profiles", profiles);
    } catch (e) {}

    return `
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        <!-- Header -->
        <div class="text-center space-y-2">
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
            <i data-lucide="sparkles" class="w-3.5 h-3.5"></i>
            <span>Smart College Assignment Generator</span>
          </div>
          <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">Create New Assignment</h1>
          <p class="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
            Fill in your college and assignment criteria. Our AI engine will structure, format, and synthesize your complete document.
          </p>
        </div>

        <!-- 4-Step Progress Indicator -->
        <div class="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div class="grid grid-cols-4 gap-2 text-center text-xs">
            <div class="cursor-pointer ${this.currentStep >= 1 ? 'text-blue-600 font-bold' : 'text-slate-400'}" onclick="CreatePage.goToStep(1)">
              <div class="w-8 h-8 rounded-full ${this.currentStep === 1 ? 'bg-blue-600 text-white shadow-md' : (this.currentStep > 1 ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-400')} flex items-center justify-center mx-auto mb-1.5 font-bold">1</div>
              <span class="hidden sm:inline">1. College Info</span>
              <span class="sm:hidden">College</span>
            </div>

            <div class="cursor-pointer ${this.currentStep >= 2 ? 'text-blue-600 font-bold' : 'text-slate-400'}" onclick="CreatePage.goToStep(2)">
              <div class="w-8 h-8 rounded-full ${this.currentStep === 2 ? 'bg-blue-600 text-white shadow-md' : (this.currentStep > 2 ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-400')} flex items-center justify-center mx-auto mb-1.5 font-bold">2</div>
              <span class="hidden sm:inline">2. Specifications</span>
              <span class="sm:hidden">Topic</span>
            </div>

            <div class="cursor-pointer ${this.currentStep >= 3 ? 'text-blue-600 font-bold' : 'text-slate-400'}" onclick="CreatePage.goToStep(3)">
              <div class="w-8 h-8 rounded-full ${this.currentStep === 3 ? 'bg-blue-600 text-white shadow-md' : (this.currentStep > 3 ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-400')} flex items-center justify-center mx-auto mb-1.5 font-bold">3</div>
              <span class="hidden sm:inline">3. Guidelines Upload</span>
              <span class="sm:hidden">Guidelines</span>
            </div>

            <div class="cursor-pointer ${this.currentStep >= 4 ? 'text-blue-600 font-bold' : 'text-slate-400'}" onclick="CreatePage.goToStep(4)">
              <div class="w-8 h-8 rounded-full ${this.currentStep === 4 ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-400'} flex items-center justify-center mx-auto mb-1.5 font-bold">4</div>
              <span class="hidden sm:inline">4. Format & Review</span>
              <span class="sm:hidden">Format</span>
            </div>
          </div>
        </div>

        <!-- Wizard Step Containers -->
        <div class="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
          <form id="create-wizard-form" onsubmit="CreatePage.handleStepSubmit(event)">
            
            <!-- STEP 1: College & Institutional Details -->
            <div id="step-1" class="${this.currentStep === 1 ? 'block' : 'hidden'} space-y-6">
              <div class="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h2 class="text-base font-bold text-slate-900">Step 1: College & University Details</h2>
                  <p class="text-xs text-slate-500">Provide the institutional context for the assignment title page and cover sheet.</p>
                </div>
                ${profiles.length > 0 ? `
                  <div class="flex items-center gap-2">
                    <span class="text-xs text-slate-500">Use Saved:</span>
                    <select onchange="CreatePage.applyProfile(this.value)" class="text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-slate-50 font-medium">
                      <option value="">Select College Profile...</option>
                      ${profiles.map(p => `<option value="${p.id}">${p.profile_name}</option>`).join('')}
                    </select>
                  </div>
                ` : ''}
              </div>

              <div class="grid sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-semibold text-slate-700 mb-1">College Name <span class="text-rose-500">*</span></label>
                  <input type="text" id="wiz-college" required value="${this.formData.college_name}" placeholder="e.g. Stanford School of Engineering" class="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600" />
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-700 mb-1">University Name</label>
                  <input type="text" id="wiz-university" value="${this.formData.university_name}" placeholder="e.g. Stanford University" class="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600" />
                </div>
              </div>

              <div class="grid sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-semibold text-slate-700 mb-1">Department</label>
                  <input type="text" id="wiz-department" value="${this.formData.department}" placeholder="e.g. Computer Science & Engineering" class="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600" />
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-700 mb-1">Course / Degree</label>
                  <input type="text" id="wiz-course" value="${this.formData.course}" placeholder="e.g. B.Tech / B.S. in Computer Science" class="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600" />
                </div>
              </div>

              <div class="grid sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-semibold text-slate-700 mb-1">Semester</label>
                  <input type="text" id="wiz-semester" value="${this.formData.semester}" placeholder="Semester VI" class="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600" />
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-700 mb-1">Academic Year</label>
                  <input type="text" id="wiz-academic-year" value="${this.formData.academic_year}" placeholder="2026-2027" class="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600" />
                </div>
              </div>

              <div class="grid sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-semibold text-slate-700 mb-1">Course Instructor / Professor Name</label>
                  <input type="text" id="wiz-instructor" value="${this.formData.instructor_name}" placeholder="e.g. Prof. David Mazieres" class="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600" />
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-700 mb-1">Student Roll No / ID</label>
                  <input type="text" id="wiz-rollno" value="${this.formData.student_roll_no}" placeholder="e.g. CS-2026-442" class="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600" />
                </div>
              </div>

              <div class="flex justify-end pt-4">
                <button type="button" onclick="CreatePage.nextStep()" class="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md transition-all flex items-center gap-2">
                  <span>Continue to Specifications</span>
                  <i data-lucide="arrow-right" class="w-4 h-4"></i>
                </button>
              </div>
            </div>

            <!-- STEP 2: Assignment Specifications -->
            <div id="step-2" class="${this.currentStep === 2 ? 'block' : 'hidden'} space-y-6">
              <div class="pb-3 border-b border-slate-100">
                <h2 class="text-base font-bold text-slate-900">Step 2: Assignment Topic & Formatting Specifications</h2>
                <p class="text-xs text-slate-500">Define the core subject matter, target word counts, and formatting rules.</p>
              </div>

              <div class="space-y-4">
                <div>
                  <label class="block text-xs font-semibold text-slate-700 mb-1">Subject Name <span class="text-rose-500">*</span></label>
                  <input type="text" id="wiz-subject" required value="${this.formData.subject}" placeholder="e.g. Distributed Operating Systems" class="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600" />
                </div>

                <div>
                  <label class="block text-xs font-semibold text-slate-700 mb-1">Assignment Topic <span class="text-rose-500">*</span></label>
                  <input type="text" id="wiz-topic" required value="${this.formData.topic}" oninput="CreatePage.autoSuggestTitle(this.value)" placeholder="e.g. Distributed Consensus Protocols in Cloud Architectures: Raft vs. Multi-Paxos" class="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600" />
                </div>

                <div>
                  <label class="block text-xs font-semibold text-slate-700 mb-1">Assignment Title (for Cover Page) <span class="text-rose-500">*</span></label>
                  <input type="text" id="wiz-title" required value="${this.formData.title}" placeholder="A Comparative Architectural Evaluation of Distributed Consensus Protocols" class="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600" />
                </div>
              </div>

              <!-- Length & Target Word Count Slider -->
              <div class="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div class="flex items-center justify-between">
                  <div>
                    <div class="text-xs font-bold text-slate-900">Target Word Count & Estimated Pages</div>
                    <div class="text-[11px] text-slate-500">Calibrates paragraph depth and section weights</div>
                  </div>
                  <div class="text-right">
                    <span id="display-words" class="text-lg font-extrabold text-blue-600">${this.formData.target_words}</span>
                    <span class="text-xs text-slate-400">words (~<span id="display-pages">${this.formData.target_pages}</span> pages)</span>
                  </div>
                </div>

                <input type="range" id="wiz-words-slider" min="500" max="8000" step="250" value="${this.formData.target_words}" oninput="CreatePage.handleWordSlider(this.value)" class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />

                <div class="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>500w (2p)</span>
                  <span>1,500w (5p)</span>
                  <span>3,000w (10p)</span>
                  <span>5,000w (18p)</span>
                  <span>8,000w (28p)</span>
                </div>
              </div>

              <!-- Formatting Rules Grid -->
              <div class="grid sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label class="block text-xs font-semibold text-slate-700 mb-1">Font Family</label>
                  <select id="wiz-font" class="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white">
                    <option value="Times New Roman" ${this.formData.font_style === 'Times New Roman' ? 'selected' : ''}>Times New Roman (Academic Standard)</option>
                    <option value="Calibri" ${this.formData.font_style === 'Calibri' ? 'selected' : ''}>Calibri (Clean Modern)</option>
                    <option value="Arial" ${this.formData.font_style === 'Arial' ? 'selected' : ''}>Arial (Sans Serif)</option>
                  </select>
                </div>

                <div>
                  <label class="block text-xs font-semibold text-slate-700 mb-1">Line Spacing</label>
                  <select id="wiz-spacing" class="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white">
                    <option value="1.5" ${this.formData.line_spacing === 1.5 ? 'selected' : ''}>1.5 Lines (Standard University)</option>
                    <option value="2.0" ${this.formData.line_spacing === 2.0 ? 'selected' : ''}>2.0 Lines (Double Spaced)</option>
                    <option value="1.15" ${this.formData.line_spacing === 1.15 ? 'selected' : ''}>1.15 Lines (Compact)</option>
                  </select>
                </div>

                <div>
                  <label class="block text-xs font-semibold text-slate-700 mb-1">Citation & Referencing</label>
                  <select id="wiz-citation" class="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white">
                    <option value="APA 7th" ${this.formData.citation_style === 'APA 7th' ? 'selected' : ''}>APA 7th Edition</option>
                    <option value="IEEE" ${this.formData.citation_style === 'IEEE' ? 'selected' : ''}>IEEE Standard (Technical/CS)</option>
                    <option value="MLA 9th" ${this.formData.citation_style === 'MLA 9th' ? 'selected' : ''}>MLA 9th Edition</option>
                    <option value="Harvard" ${this.formData.citation_style === 'Harvard' ? 'selected' : ''}>Harvard Referencing</option>
                    <option value="Chicago" ${this.formData.citation_style === 'Chicago' ? 'selected' : ''}>Chicago Manual of Style</option>
                  </select>
                </div>
              </div>

              <div class="grid sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-semibold text-slate-700 mb-1">Page Margins</label>
                  <select id="wiz-margins" class="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white">
                    <option value="1 inch (2.54 cm)">Normal (1 inch / 2.54 cm on all sides)</option>
                    <option value="Narrow (0.5 inch)">Narrow (0.5 inch)</option>
                    <option value="Moderate (1 in top/bottom, 0.75 in sides)">Moderate</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-700 mb-1">Submission Deadline (Optional)</label>
                  <input type="text" id="wiz-deadline" value="${this.formData.deadline}" placeholder="e.g. December 15, 2026" class="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300" />
                </div>
              </div>

              <div class="flex justify-between pt-4">
                <button type="button" onclick="CreatePage.prevStep()" class="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold rounded-xl transition-all">
                  Back
                </button>
                <button type="button" onclick="CreatePage.nextStep()" class="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md transition-all flex items-center gap-2">
                  <span>Continue to Guidelines</span>
                  <i data-lucide="arrow-right" class="w-4 h-4"></i>
                </button>
              </div>
            </div>

            <!-- STEP 3: Guidelines Upload & Document Parsing -->
            <div id="step-3" class="${this.currentStep === 3 ? 'block' : 'hidden'} space-y-6">
              <div class="pb-3 border-b border-slate-100">
                <h2 class="text-base font-bold text-slate-900">Step 3: Upload College Guidelines or Sample Document</h2>
                <p class="text-xs text-slate-500">Attach your college syllabus, rubric PDF, or DOCX template. Our parser will extract instructions.</p>
              </div>

              <!-- Drag and Drop Box -->
              <div id="guideline-dropzone" ondragover="CreatePage.handleDragOver(event)" ondragleave="CreatePage.handleDragLeave(event)" ondrop="CreatePage.handleDrop(event)" class="border-2 border-dashed border-slate-300 hover:border-blue-400 bg-slate-50/60 p-8 rounded-2xl text-center transition-all cursor-pointer" onclick="document.getElementById('wiz-file-input').click()">
                <input type="file" id="wiz-file-input" accept=".pdf,.docx,.txt" class="hidden" onchange="CreatePage.handleFileSelected(event)" />
                <div class="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-3 shadow-sm">
                  <i data-lucide="upload-cloud" class="w-6 h-6"></i>
                </div>
                <div class="text-sm font-bold text-slate-800">
                  Click to browse or drag & drop college guidelines
                </div>
                <div class="text-xs text-slate-400 mt-1">Supports PDF, Word (.docx), or Text (.txt) up to 25MB</div>
              </div>

              <!-- Uploaded file info & insights pill -->
              <div id="guideline-status-box" class="${this.formData.guidelines_filename ? 'block' : 'hidden'} p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 space-y-2">
                <div class="flex items-center justify-between font-bold">
                  <span class="flex items-center gap-1.5">
                    <i data-lucide="file-check" class="w-4 h-4 text-emerald-600"></i>
                    <span id="guideline-filename-display">${this.formData.guidelines_filename}</span>
                  </span>
                  <button type="button" onclick="CreatePage.clearUploadedFile()" class="text-rose-600 hover:underline">Remove</button>
                </div>
                <div id="guideline-insights-summary" class="text-[11px] text-emerald-700 font-medium"></div>
              </div>

              <!-- Raw Textarea for Guidelines / Custom Instructions -->
              <div class="space-y-1.5">
                <div class="flex items-center justify-between">
                  <label class="block text-xs font-semibold text-slate-700">Special Instructions & Guidelines Text</label>
                  <span class="text-[10px] text-slate-400">Paste syllabus or extra constraints</span>
                </div>
                <textarea id="wiz-guidelines-text" rows="5" placeholder="e.g. Ensure clear mathematical formulation in chapter 2; incorporate empirical benchmarks; follow APA 7th style..." class="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600">${this.formData.guidelines_text}</textarea>
              </div>

              <div class="flex justify-between pt-4">
                <button type="button" onclick="CreatePage.prevStep()" class="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold rounded-xl transition-all">
                  Back
                </button>
                <button type="button" onclick="CreatePage.nextStep()" class="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md transition-all flex items-center gap-2">
                  <span>Continue to Format Selection</span>
                  <i data-lucide="arrow-right" class="w-4 h-4"></i>
                </button>
              </div>
            </div>

            <!-- STEP 4: Format Selection & Final Launch -->
            <div id="step-4" class="${this.currentStep === 4 ? 'block' : 'hidden'} space-y-6">
              <div class="pb-3 border-b border-slate-100">
                <h2 class="text-base font-bold text-slate-900">Step 4: Select Assignment Format & Generate</h2>
                <p class="text-xs text-slate-500">Pick the structure blueprint that aligns with your college assignment type.</p>
              </div>

              <!-- Format Grid (Radio Cards) -->
              <div class="grid sm:grid-cols-2 gap-3.5" id="format-cards-container">
                ${[
                  { name: "Standard college assignment", badge: "General", desc: "Intro, Objectives, Theoretical Framework, Core Analysis, Practical Implications, Conclusion" },
                  { name: "Technical assignment", badge: "Engineering/CS", desc: "System Architecture, Mathematical Foundations, Algorithm Workflow, Performance Metrics, Security" },
                  { name: "Research-based assignment", badge: "Empirical", desc: "Abstract, Research Context, Problem Statement, Methodology, Empirical Findings, Limitations" },
                  { name: "Practical assignment", badge: "Lab Journal", desc: "Aim & Safety, Apparatus & Tools, Protocol, Observation Tables, Error Analysis, Inferences" },
                  { name: "Case study", badge: "Business/MBA", desc: "Executive Summary, Strategic Dilemmas, SWOT/PESTLE Matrix, Alternative Evaluation, Action Plan" },
                  { name: "Project documentation", badge: "Software", desc: "Charter, SRS Specifications, Modular Architecture, QA Verification, Deployment & User Manual" },
                  { name: "University-specific assignment", badge: "Curriculum", desc: "Compliance with Syllabus, Methodological Survey, Subject Exposition, Analytical Synthesis" },
                ].map((fmt, i) => `
                  <div onclick="CreatePage.selectFormat('${fmt.name}')" class="format-card p-4 rounded-xl border cursor-pointer transition-all ${this.formData.format_type === fmt.name ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20' : 'border-slate-200 hover:border-slate-300 bg-white'}">
                    <div class="flex items-center justify-between mb-1.5">
                      <div class="font-bold text-slate-900 text-xs sm:text-sm">${fmt.name}</div>
                      <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full ${this.formData.format_type === fmt.name ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}">${fmt.badge}</span>
                    </div>
                    <p class="text-[11px] text-slate-500 leading-relaxed">${fmt.desc}</p>
                  </div>
                `).join('')}
              </div>

              <!-- Summary Card Before Generating -->
              <div class="p-5 rounded-2xl bg-slate-900 text-white space-y-3">
                <div class="flex items-center justify-between text-xs text-blue-300 font-semibold uppercase tracking-wider">
                  <span>Generation Blueprint Summary</span>
                  <span class="text-emerald-400 flex items-center gap-1">
                    <i data-lucide="check-circle" class="w-3.5 h-3.5"></i> Ready to Synthesize
                  </span>
                </div>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
                  <div>
                    <div class="text-[10px] text-slate-400">Target Length</div>
                    <div class="font-bold font-mono text-white">${this.formData.target_words} words (${this.formData.target_pages}p)</div>
                  </div>
                  <div>
                    <div class="text-[10px] text-slate-400">Citation Style</div>
                    <div class="font-bold text-white">${this.formData.citation_style}</div>
                  </div>
                  <div>
                    <div class="text-[10px] text-slate-400">Typography</div>
                    <div class="font-bold text-white">${this.formData.font_style} (${this.formData.line_spacing}x)</div>
                  </div>
                  <div>
                    <div class="text-[10px] text-slate-400">Format Type</div>
                    <div class="font-bold text-blue-300 truncate" id="summary-format-display">${this.formData.format_type}</div>
                  </div>
                </div>
              </div>

              <div class="flex justify-between pt-4">
                <button type="button" onclick="CreatePage.prevStep()" class="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold rounded-xl transition-all">
                  Back
                </button>
                <button type="submit" id="generate-submit-btn" class="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2.5 transform hover:-translate-y-0.5">
                  <i data-lucide="sparkles" class="w-4 h-4"></i>
                  <span>Generate Complete Assignment</span>
                </button>
              </div>
            </div>

          </form>
        </div>

      </div>
    `;
  },

  handleWordSlider(val) {
    this.formData.target_words = parseInt(val);
    this.formData.target_pages = Math.max(1, Math.round(this.formData.target_words / 275));
    const dw = document.getElementById("display-words");
    const dp = document.getElementById("display-pages");
    if (dw) dw.textContent = this.formData.target_words.toLocaleString();
    if (dp) dp.textContent = this.formData.target_pages;
  },

  autoSuggestTitle(topic) {
    const titleInput = document.getElementById("wiz-title");
    if (titleInput && (!titleInput.value || titleInput.value.startsWith("A Comprehensive Study on"))) {
      if (topic.trim().length > 5) {
        titleInput.value = `A Comprehensive Study on ${topic.trim()}`;
      }
    }
  },

  applyProfile(profileId) {
    const profiles = window.appState.get("profiles") || [];
    const prof = profiles.find(p => p.id == profileId);
    if (!prof) return;

    if (prof.college_name) document.getElementById("wiz-college").value = prof.college_name;
    if (prof.university_name) document.getElementById("wiz-university").value = prof.university_name;
    if (prof.department) document.getElementById("wiz-department").value = prof.department;
    if (prof.course) document.getElementById("wiz-course").value = prof.course;
    UI.showToast(`Applied preset '${prof.profile_name}'!`, "info");
  },

  goToStep(step) {
    this.syncFormValues();
    this.currentStep = step;
    router.render();
  },

  nextStep() {
    this.syncFormValues();
    if (this.currentStep === 1) {
      if (!this.formData.college_name) {
        UI.showToast("Please enter your college name.", "error");
        return;
      }
    }
    if (this.currentStep === 2) {
      if (!this.formData.subject || !this.formData.topic || !this.formData.title) {
        UI.showToast("Please enter subject name, topic, and title.", "error");
        return;
      }
    }
    this.currentStep = Math.min(4, this.currentStep + 1);
    router.render();
  },

  prevStep() {
    this.syncFormValues();
    this.currentStep = Math.max(1, this.currentStep - 1);
    router.render();
  },

  selectFormat(name) {
    this.formData.format_type = name;
    router.render();
  },

  syncFormValues() {
    const c = document.getElementById("wiz-college");
    if (c) this.formData.college_name = c.value.trim();
    const u = document.getElementById("wiz-university");
    if (u) this.formData.university_name = u.value.trim();
    const d = document.getElementById("wiz-department");
    if (d) this.formData.department = d.value.trim();
    const cr = document.getElementById("wiz-course");
    if (cr) this.formData.course = cr.value.trim();
    const sm = document.getElementById("wiz-semester");
    if (sm) this.formData.semester = sm.value.trim();
    const ay = document.getElementById("wiz-academic-year");
    if (ay) this.formData.academic_year = ay.value.trim();
    const inst = document.getElementById("wiz-instructor");
    if (inst) this.formData.instructor_name = inst.value.trim();
    const roll = document.getElementById("wiz-rollno");
    if (roll) this.formData.student_roll_no = roll.value.trim();

    const subj = document.getElementById("wiz-subject");
    if (subj) this.formData.subject = subj.value.trim();
    const top = document.getElementById("wiz-topic");
    if (top) this.formData.topic = top.value.trim();
    const tit = document.getElementById("wiz-title");
    if (tit) this.formData.title = tit.value.trim();

    const font = document.getElementById("wiz-font");
    if (font) this.formData.font_style = font.value;
    const sp = document.getElementById("wiz-spacing");
    if (sp) this.formData.line_spacing = parseFloat(sp.value);
    const cit = document.getElementById("wiz-citation");
    if (cit) this.formData.citation_style = cit.value;
    const mg = document.getElementById("wiz-margins");
    if (mg) this.formData.page_margins = mg.value;
    const dead = document.getElementById("wiz-deadline");
    if (dead) this.formData.deadline = dead.value.trim();

    const gt = document.getElementById("wiz-guidelines-text");
    if (gt) this.formData.guidelines_text = gt.value;
  },

  handleDragOver(e) {
    e.preventDefault();
    document.getElementById("guideline-dropzone").classList.add("border-blue-500", "bg-blue-50/40");
  },

  handleDragLeave(e) {
    e.preventDefault();
    document.getElementById("guideline-dropzone").classList.remove("border-blue-500", "bg-blue-50/40");
  },

  handleDrop(e) {
    e.preventDefault();
    document.getElementById("guideline-dropzone").classList.remove("border-blue-500", "bg-blue-50/40");
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      this.processFile(e.dataTransfer.files[0]);
    }
  },

  handleFileSelected(e) {
    if (e.target.files && e.target.files.length > 0) {
      this.processFile(e.target.files[0]);
    }
  },

  async processFile(file) {
    UI.showToast(`Uploading and analyzing '${file.name}'...`, "info");
    try {
      const res = await window.api.uploadGuidelines(file);
      this.formData.guidelines_filename = res.filename;
      this.formData.guidelines_text = (this.formData.guidelines_text ? this.formData.guidelines_text + "\n\n" : "") + res.extracted_text;

      // Auto-apply detected parameters
      if (res.insights.detected_word_count) {
        this.formData.target_words = res.insights.detected_word_count;
        this.formData.target_pages = Math.max(1, Math.round(this.formData.target_words / 275));
      }
      if (res.insights.detected_citation) {
        this.formData.citation_style = res.insights.detected_citation;
      }
      if (res.insights.detected_font) {
        this.formData.font_style = res.insights.detected_font;
      }
      if (res.insights.detected_spacing) {
        this.formData.line_spacing = res.insights.detected_spacing;
      }

      router.render();
      UI.showToast("Guidelines analyzed! Parameters automatically adjusted.", "success");
    } catch (err) {
      UI.showToast("Failed to upload guidelines: " + err.message, "error");
    }
  },

  clearUploadedFile() {
    this.formData.guidelines_filename = "";
    router.render();
  },

  async handleStepSubmit(event) {
    event.preventDefault();
    this.syncFormValues();

    if (!this.formData.topic || !this.formData.subject) {
      UI.showToast("Please provide subject and topic.", "error");
      return;
    }

    // Launch AI Generation Screen
    router.navigate("generating", { payload: { ...this.formData } });
  }
};

window.CreatePage = CreatePage;
