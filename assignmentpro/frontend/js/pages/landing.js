/**
 * AssignmentPro Landing Page
 * Modern, high-conversion academic SaaS landing page.
 */

const LandingPage = {
  render() {
    return `
      <!-- Hero Section -->
      <section class="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden bg-gradient-to-b from-blue-50/60 via-slate-50/30 to-white border-b border-slate-100">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid lg:grid-cols-12 gap-12 items-center">
            
            <!-- Left Hero Column -->
            <div class="lg:col-span-7 text-center lg:text-left space-y-6">
              <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/70 border border-blue-200/80 text-blue-800 text-xs font-semibold shadow-sm">
                <span class="w-2 h-2 rounded-full bg-blue-600 pulse-glow"></span>
                <span>AssignmentPro 2026 Academic Edition</span>
                <i data-lucide="sparkles" class="w-3.5 h-3.5 text-blue-600"></i>
              </div>

              <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
                Generate Professional <br class="hidden sm:inline" />
                <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-blue-600 to-sky-500">
                  College Assignments
                </span>
                <br class="hidden sm:inline" /> In Minutes.
              </h1>

              <p class="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Smart, AI-powered academic generator built strictly around your college criteria, university syllabi, and citation rules. Upload guidelines or choose standard formats for instant, publication-ready DOCX & PDF documents.
              </p>

              <!-- CTA Buttons -->
              <div class="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <button onclick="router.navigate('auth', { mode: 'register' })" class="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base rounded-xl shadow-lg shadow-blue-500/25 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2.5">
                  <span>Start Creating Free</span>
                  <i data-lucide="arrow-right" class="w-5 h-5"></i>
                </button>
                <button onclick="window.appActions.loginDemoStudent()" class="w-full sm:w-auto px-6 py-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold text-base rounded-xl shadow-sm transition-all flex items-center justify-center gap-2">
                  <i data-lucide="play-circle" class="w-5 h-5 text-blue-600"></i>
                  <span>Try Demo Account</span>
                </button>
              </div>

              <!-- Trust / University Badges -->
              <div class="pt-6 border-t border-slate-200/60 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 text-xs text-slate-500">
                <span class="flex items-center gap-1.5"><i data-lucide="check" class="w-4 h-4 text-emerald-600"></i> Works on all phones & laptops</span>
                <span class="flex items-center gap-1.5"><i data-lucide="check" class="w-4 h-4 text-emerald-600"></i> APA, IEEE, MLA & Harvard</span>
                <span class="flex items-center gap-1.5"><i data-lucide="check" class="w-4 h-4 text-emerald-600"></i> Zero software install required</span>
              </div>
            </div>

            <!-- Right Hero Column: Live Academic Document Mock -->
            <div class="lg:col-span-5 relative">
              <div class="relative mx-auto max-w-md lg:max-w-none">
                <!-- Glowing background pill -->
                <div class="absolute -inset-1.5 bg-gradient-to-r from-blue-600 to-sky-400 rounded-2xl blur-lg opacity-25"></div>
                
                <!-- Mockup Card -->
                <div class="relative bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
                  <!-- Browser bar -->
                  <div class="bg-slate-900 px-4 py-3 flex items-center justify-between">
                    <div class="flex items-center gap-1.5">
                      <div class="w-3 h-3 rounded-full bg-rose-500"></div>
                      <div class="w-3 h-3 rounded-full bg-amber-500"></div>
                      <div class="w-3 h-3 rounded-full bg-emerald-500"></div>
                    </div>
                    <span class="text-xs text-slate-400 font-mono">AssignmentPro Preview &bull; PDF/DOCX</span>
                    <span class="px-2 py-0.5 rounded text-[10px] bg-emerald-900/60 text-emerald-300 font-semibold border border-emerald-700">Ready</span>
                  </div>

                  <!-- Document Canvas Preview -->
                  <div class="p-6 bg-slate-50 space-y-4 text-left">
                    <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3 font-academic">
                      <div class="text-center pb-3 border-b border-slate-200">
                        <div class="text-[11px] font-bold tracking-widest text-blue-900 uppercase">STANFORD SCHOOL OF ENGINEERING</div>
                        <div class="text-xs text-slate-500 font-sans mt-0.5">Department of Computer Science</div>
                        <div class="text-sm font-bold text-slate-900 mt-2">Distributed Consensus Protocols: Raft vs. Multi-Paxos</div>
                        <div class="text-[10px] text-slate-400 font-sans mt-1">Subject: Distributed Systems &bull; Citation: IEEE Standard</div>
                      </div>

                      <div class="space-y-1.5 text-[11px] text-slate-700 leading-relaxed">
                        <div class="font-bold text-blue-900 text-xs font-sans">1.0 Introduction and Theoretical Problem</div>
                        <p>The rapid expansion of distributed computing paradigms necessitates robust algorithmic consensus under asynchronous network partitions. Seminal contributions by Russell & Norvig (2020) and Tanenbaum (2021) demonstrate that deterministic predictability demands strict state invariants...</p>
                      </div>

                      <!-- Mini Table -->
                      <div class="pt-2">
                        <div class="text-[10px] font-bold text-slate-600 font-sans mb-1">Table 1: Latency & Convergence Telemetry</div>
                        <div class="border border-slate-200 rounded text-[9px] font-sans">
                          <div class="bg-blue-900 text-white font-semibold flex p-1 justify-between">
                            <span>Protocol</span><span>Throughput</span><span>Latency</span>
                          </div>
                          <div class="flex p-1 justify-between border-t border-slate-100 bg-white">
                            <span>Multi-Paxos</span><span>3,890 ops/s</span><span>18.6 ms</span>
                          </div>
                          <div class="flex p-1 justify-between border-t border-slate-100 bg-slate-50">
                            <span>Raft Quorum</span><span>3,420 ops/s</span><span>21.4 ms</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Floating metric pill -->
                    <div class="flex items-center justify-between text-xs font-sans px-3 py-2 bg-white rounded-xl border border-slate-200 shadow-sm text-slate-600">
                      <span class="flex items-center gap-1.5 font-medium">
                        <i data-lucide="file-check" class="w-4 h-4 text-blue-600"></i> Word Count: 1,820 words
                      </span>
                      <span class="text-emerald-600 font-semibold flex items-center gap-1">
                        <i data-lucide="check" class="w-3.5 h-3.5"></i> Verified References
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <!-- Key Capabilities Grid -->
      <section id="features" class="py-20 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 class="text-xs font-bold tracking-widest text-blue-600 uppercase">Engineered for Academic Excellence</h2>
            <h3 class="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Everything a College Student Needs</h3>
            <p class="text-base text-slate-600">From guideline parsing to final PDF and DOCX downloads, AssignmentPro handles every academic rule automatically.</p>
          </div>

          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <!-- Feature 1 -->
            <div class="p-8 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:border-blue-200 transition-all duration-300">
              <div class="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6">
                <i data-lucide="file-search" class="w-6 h-6"></i>
              </div>
              <h4 class="text-lg font-bold text-slate-900 mb-2">Guideline Understanding</h4>
              <p class="text-sm text-slate-600 leading-relaxed">
                Upload your professor's assignment PDF or rubric. AssignmentPro parses page requirements, citation styles, word counts, and mandatory sections automatically.
              </p>
            </div>

            <!-- Feature 2 -->
            <div class="p-8 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:border-blue-200 transition-all duration-300">
              <div class="w-12 h-12 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center mb-6">
                <i data-lucide="layout-template" class="w-6 h-6"></i>
              </div>
              <h4 class="text-lg font-bold text-slate-900 mb-2">7 Academic Formats</h4>
              <p class="text-sm text-slate-600 leading-relaxed">
                Select from Term Papers, University Syllabi, Empirical Research, Technical/Code assignments, Lab Practicals, Case Studies, and Software Projects.
              </p>
            </div>

            <!-- Feature 3 -->
            <div class="p-8 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:border-blue-200 transition-all duration-300">
              <div class="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-6">
                <i data-lucide="book-open-check" class="w-6 h-6"></i>
              </div>
              <h4 class="text-lg font-bold text-slate-900 mb-2">Authentic References</h4>
              <p class="text-sm text-slate-600 leading-relaxed">
                Never worry about hallucinated citations. Our engine uses verified, landmark literature and standard peer-reviewed textbooks formatted in APA, IEEE, MLA, Harvard, or Chicago.
              </p>
            </div>

            <!-- Feature 4 -->
            <div class="p-8 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:border-blue-200 transition-all duration-300">
              <div class="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-6">
                <i data-lucide="edit-3" class="w-6 h-6"></i>
              </div>
              <h4 class="text-lg font-bold text-slate-900 mb-2">Interactive AI Editor</h4>
              <p class="text-sm text-slate-600 leading-relaxed">
                Tweak any section with built-in AI assistive tools: Expand content, Condense arguments, Elevate formal academic tone, Fix grammar, or Insert data tables.
              </p>
            </div>

            <!-- Feature 5 -->
            <div class="p-8 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:border-blue-200 transition-all duration-300">
              <div class="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6">
                <i data-lucide="download" class="w-6 h-6"></i>
              </div>
              <h4 class="text-lg font-bold text-slate-900 mb-2">Instant PDF & DOCX Export</h4>
              <p class="text-sm text-slate-600 leading-relaxed">
                Download styled Word documents with proper heading levels and tables, or download publication-grade PDFs with cover pages and running page numbering.
              </p>
            </div>

            <!-- Feature 6 -->
            <div class="p-8 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:border-blue-200 transition-all duration-300">
              <div class="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-6">
                <i data-lucide="bookmark" class="w-6 h-6"></i>
              </div>
              <h4 class="text-lg font-bold text-slate-900 mb-2">Reusable College Profiles</h4>
              <p class="text-sm text-slate-600 leading-relaxed">
                Save your college name, department, roll number, and preferred formatting once. Auto-fill all future assignments in one click.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- 4-Step How It Works -->
      <section id="how-it-works" class="py-20 bg-slate-50 border-y border-slate-200/80">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 class="text-xs font-bold tracking-widest text-blue-600 uppercase">Seamless Workflow</h2>
            <h3 class="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">How AssignmentPro Works</h3>
            <p class="text-base text-slate-600">Four simple steps to transform your syllabus and assignment topic into a complete submission.</p>
          </div>

          <div class="grid md:grid-cols-4 gap-8">
            <div class="bg-white p-6 rounded-2xl border border-slate-200 text-center relative shadow-sm">
              <div class="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center mx-auto mb-4 text-sm shadow-md">1</div>
              <h4 class="font-bold text-slate-900 mb-2">Enter Criteria</h4>
              <p class="text-xs text-slate-500 leading-relaxed">Specify college name, subject, topic, word count, margins, and citation style.</p>
            </div>

            <div class="bg-white p-6 rounded-2xl border border-slate-200 text-center relative shadow-sm">
              <div class="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center mx-auto mb-4 text-sm shadow-md">2</div>
              <h4 class="font-bold text-slate-900 mb-2">Upload Guidelines</h4>
              <p class="text-xs text-slate-500 leading-relaxed">Attach your professor's rubric, PDF, or sample guidelines for automatic rule alignment.</p>
            </div>

            <div class="bg-white p-6 rounded-2xl border border-slate-200 text-center relative shadow-sm">
              <div class="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center mx-auto mb-4 text-sm shadow-md">3</div>
              <h4 class="font-bold text-slate-900 mb-2">AI Synthesizes</h4>
              <p class="text-xs text-slate-500 leading-relaxed">Our engine constructs structured chapters, analytical tables, and genuine references.</p>
            </div>

            <div class="bg-white p-6 rounded-2xl border border-slate-200 text-center relative shadow-sm">
              <div class="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center mx-auto mb-4 text-sm shadow-md">4</div>
              <h4 class="font-bold text-slate-900 mb-2">Edit & Download</h4>
              <p class="text-xs text-slate-500 leading-relaxed">Review the live A4 preview, polish sections, and download formatted DOCX or PDF.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Academic Formats Showcase -->
      <section id="formats" class="py-20 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 class="text-xs font-bold tracking-widest text-blue-600 uppercase">Tailored Architectures</h2>
            <h3 class="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Assignment Formats Supported</h3>
            <p class="text-base text-slate-600">Every major academic genre with dedicated section outlines and evaluation rubrics.</p>
          </div>

          <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="p-6 rounded-xl border border-slate-200 hover:border-blue-300 transition-colors">
              <div class="text-blue-600 font-bold text-base mb-1">Standard College Assignment</div>
              <div class="text-xs text-slate-500 mb-3">Intro &bull; Objectives &bull; Theory &bull; Analysis &bull; Conclusion</div>
              <p class="text-xs text-slate-600">The essential format for semester essays, term papers, and modular homework.</p>
            </div>

            <div class="p-6 rounded-xl border border-slate-200 hover:border-blue-300 transition-colors">
              <div class="text-blue-600 font-bold text-base mb-1">Technical & Engineering</div>
              <div class="text-xs text-slate-500 mb-3">Architecture &bull; Algorithms &bull; Benchmarks &bull; Security</div>
              <p class="text-xs text-slate-600">Engineered for CS, IT, and Electrical assignments with comparative data tables.</p>
            </div>

            <div class="p-6 rounded-xl border border-slate-200 hover:border-blue-300 transition-colors">
              <div class="text-blue-600 font-bold text-base mb-1">Empirical Research Paper</div>
              <div class="text-xs text-slate-500 mb-3">Abstract &bull; Hypotheses &bull; Methodology &bull; Data &bull; Survey</div>
              <p class="text-xs text-slate-600">Formal publication-style template suitable for capstone research and mini-theses.</p>
            </div>

            <div class="p-6 rounded-xl border border-slate-200 hover:border-blue-300 transition-colors">
              <div class="text-blue-600 font-bold text-base mb-1">Business & Strategic Case Study</div>
              <div class="text-xs text-slate-500 mb-3">Executive Summary &bull; SWOT &bull; Strategic Options &bull; ROI</div>
              <p class="text-xs text-slate-600">Specialized for MBA and BBA case dilemmas, stakeholder matrices, and action plans.</p>
            </div>

            <div class="p-6 rounded-xl border border-slate-200 hover:border-blue-300 transition-colors">
              <div class="text-blue-600 font-bold text-base mb-1">Laboratory & Practical Journal</div>
              <div class="text-xs text-slate-500 mb-3">Aim &bull; Apparatus &bull; Protocol &bull; Observation Table &bull; Error</div>
              <p class="text-xs text-slate-600">Structured for science experiments, lab manual writeups, and telemetry records.</p>
            </div>

            <div class="p-6 rounded-xl border border-slate-200 hover:border-blue-300 transition-colors">
              <div class="text-blue-600 font-bold text-base mb-1">Software Project Documentation</div>
              <div class="text-xs text-slate-500 mb-3">Project Charter &bull; SRS &bull; Data Flow &bull; Testing &bull; User Manual</div>
              <p class="text-xs text-slate-600">Complete software engineering report format adhering to IEEE standards.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- FAQ Section -->
      <section id="faq" class="py-20 bg-slate-50 border-t border-slate-200/80">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-12 space-y-2">
            <h2 class="text-xs font-bold tracking-widest text-blue-600 uppercase">Frequently Asked Questions</h2>
            <h3 class="text-3xl font-extrabold text-slate-900">Got Questions? We Have Answers.</h3>
          </div>

          <div class="space-y-4">
            <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h4 class="font-bold text-slate-900 mb-2 text-sm">Does AssignmentPro invent or hallucinate references?</h4>
              <p class="text-xs text-slate-600 leading-relaxed">No. AssignmentPro incorporates genuine, authentic academic textbooks and landmark peer-reviewed literature with real author names, publication years, and DOIs according to your citation preference (APA 7th, IEEE, MLA 9th, Harvard, Chicago).</p>
            </div>

            <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h4 class="font-bold text-slate-900 mb-2 text-sm">Can I edit the generated assignment before downloading?</h4>
              <p class="text-xs text-slate-600 leading-relaxed">Yes! AssignmentPro includes a full section-by-section and document editor. You can rephrase paragraphs, expand sections, add comparative tables, or ask the AI to elevate academic formality.</p>
            </div>

            <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h4 class="font-bold text-slate-900 mb-2 text-sm">What file formats can I download?</h4>
              <p class="text-xs text-slate-600 leading-relaxed">You can download formatted Microsoft Word documents (.docx) with cover pages and structured styles, publication-ready PDF documents (.pdf) with page numbers, or plain text (.txt).</p>
            </div>

            <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h4 class="font-bold text-slate-900 mb-2 text-sm">Can I use it on my mobile phone?</h4>
              <p class="text-xs text-slate-600 leading-relaxed">Yes. AssignmentPro is 100% web-based and fully responsive across mobile phones, tablets, iPads, MacBooks, and Windows PCs.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Bottom CTA Banner -->
      <section class="py-16 bg-blue-900 text-white text-center">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight">Ready to Generate Your College Assignment?</h2>
          <p class="text-blue-200 text-base max-w-2xl mx-auto">Join thousands of students who save countless hours while creating top-tier academic assignments.</p>
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button onclick="router.navigate('auth', { mode: 'register' })" class="px-8 py-3.5 bg-white text-blue-900 hover:bg-blue-50 font-bold rounded-xl shadow-lg transition-all">
              Create Assignment Now
            </button>
            <button onclick="window.appActions.loginDemoStudent()" class="px-6 py-3.5 bg-blue-800 hover:bg-blue-700 text-white font-semibold rounded-xl border border-blue-700 transition-all">
              Launch Demo Student
            </button>
          </div>
        </div>
      </section>
    `;
  }
};

window.LandingPage = LandingPage;
