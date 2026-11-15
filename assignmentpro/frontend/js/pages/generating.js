/**
 * AssignmentPro AI Generation Page
 * Real-time progress visualizer with step-by-step checklist and live terminal ticker.
 */

const GeneratingPage = {
  payload: null,
  progress: 10,
  activeStepIndex: 0,
  steps: [
    { title: "Analyzing College Criteria & Guidelines", desc: "Parsing syllabus, word count, margins, and rubric constraints" },
    { title: "Structuring Document Architecture", desc: "Drafting chapter hierarchy, headings, and section word allocations" },
    { title: "Synthesizing Academic Foundations & Literature", desc: "Formulating theoretical models, objectives, and problem statement" },
    { title: "Developing Core Analysis & Analytical Tables", desc: "Generating empirical findings, comparative telemetry, and detailed findings" },
    { title: "Formulating Inferences & Conclusion", desc: "Synthesizing critical evaluation, recommendations, and academic deductions" },
    { title: "Cross-Checking Authentic Literature & Citations", desc: "Formatting landmark references in requested citation standard" },
    { title: "Compiling Final Document & Title Page", desc: "Generating cover sheet, table of contents, and page numbering layout" }
  ],

  render(params = {}) {
    if (params.payload) {
      this.payload = params.payload;
    }

    // Trigger generation process after render
    setTimeout(() => this.startGenerationWorkflow(), 150);

    return `
      <div class="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-2xl w-full space-y-8 text-center">
          
          <!-- Animated Spinner / Badge -->
          <div class="relative w-20 h-20 mx-auto">
            <div class="absolute inset-0 rounded-full border-4 border-blue-100"></div>
            <div class="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
            <div class="absolute inset-0 flex items-center justify-center text-blue-600">
              <i data-lucide="sparkles" class="w-8 h-8 pulse-glow"></i>
            </div>
          </div>

          <!-- Main Status Headline -->
          <div class="space-y-2">
            <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Generating Your College Assignment...
            </h1>
            <p id="generating-subtitle" class="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
              Our academic engine is building your assignment according to ${this.payload?.college_name || 'your college'} guidelines.
            </p>
          </div>

          <!-- Progress Bar -->
          <div class="space-y-2 max-w-md mx-auto">
            <div class="w-full bg-slate-100 rounded-full h-3 p-0.5 border border-slate-200 overflow-hidden">
              <div id="gen-progress-bar" class="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full transition-all duration-500 ease-out" style="width: 15%"></div>
            </div>
            <div class="flex justify-between text-[11px] text-slate-400 font-mono">
              <span id="gen-status-text">Initializing AI models...</span>
              <span id="gen-percent-text">15%</span>
            </div>
          </div>

          <!-- Step-by-Step Checklist Card -->
          <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-left max-w-lg mx-auto space-y-3.5">
            <div class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Synthesis Milestones</div>
            ${this.steps.map((st, i) => `
              <div id="step-row-${i}" class="flex items-start gap-3 transition-opacity ${i === 0 ? 'opacity-100' : 'opacity-40'}">
                <div id="step-icon-${i}" class="w-5 h-5 rounded-full ${i === 0 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'} flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                  ${i + 1}
                </div>
                <div class="flex-1 min-w-0">
                  <div id="step-title-${i}" class="text-xs font-semibold text-slate-800">${st.title}</div>
                  <div class="text-[10px] text-slate-400 truncate">${st.desc}</div>
                </div>
              </div>
            `).join('')}
          </div>

          <!-- Live Ticker Console -->
          <div class="bg-slate-900 text-slate-300 p-4 rounded-xl text-left font-mono text-[11px] max-w-lg mx-auto shadow-inner border border-slate-800">
            <div class="flex items-center gap-1.5 text-slate-500 mb-2 border-b border-slate-800 pb-1.5 text-[10px]">
              <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>AssignmentPro Academic AI Engine Telemetry</span>
            </div>
            <div id="ticker-output" class="space-y-1 h-16 overflow-y-auto">
              <div class="text-slate-400">> Initializing assignment blueprint...</div>
              <div class="text-blue-400">> Calibrating section weights for ${this.payload?.target_words || 1500} words...</div>
            </div>
          </div>

        </div>
      </div>
    `;
  },

  async startGenerationWorkflow() {
    if (!this.payload) {
      router.navigate("create");
      return;
    }

    const ticker = document.getElementById("ticker-output");
    const pBar = document.getElementById("gen-progress-bar");
    const pText = document.getElementById("gen-percent-text");
    const sText = document.getElementById("gen-status-text");

    const logTick = (msg, color = "text-slate-300") => {
      if (ticker) {
        const line = document.createElement("div");
        line.className = color;
        line.textContent = `> ${msg}`;
        ticker.appendChild(line);
        ticker.scrollTop = ticker.scrollHeight;
      }
    };

    const updateStepUI = (stepIndex, percent) => {
      if (pBar) pBar.style.width = `${percent}%`;
      if (pText) pText.textContent = `${percent}%`;
      
      this.steps.forEach((_, idx) => {
        const row = document.getElementById(`step-row-${idx}`);
        const icon = document.getElementById(`step-icon-${idx}`);
        if (!row || !icon) return;

        if (idx < stepIndex) {
          row.classList.remove("opacity-40");
          row.classList.add("opacity-100");
          icon.className = "w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5";
          icon.innerHTML = `<i data-lucide="check" class="w-3 h-3"></i>`;
        } else if (idx === stepIndex) {
          row.classList.remove("opacity-40");
          row.classList.add("opacity-100");
          icon.className = "w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5 animate-pulse";
          icon.textContent = idx + 1;
        } else {
          row.classList.add("opacity-40");
        }
      });
      if (window.lucide) window.lucide.createIcons();
    };

    // Step 1: Guidelines
    logTick("Analyzing guidelines and section distribution...", "text-blue-300");
    updateStepUI(1, 25);
    if (sText) sText.textContent = "Analyzing guidelines...";

    // Start background API call
    const apiPromise = window.api.generateAssignment(this.payload);

    // Simulated progress steps while API processes
    setTimeout(() => {
      logTick("Formulating academic theoretical foundation...", "text-slate-300");
      updateStepUI(2, 45);
      if (sText) sText.textContent = "Writing core chapters...";
    }, 500);

    setTimeout(() => {
      logTick("Constructing empirical data tables and comparative telemetry...", "text-slate-300");
      updateStepUI(3, 65);
      if (sText) sText.textContent = "Generating data matrices...";
    }, 1100);

    setTimeout(() => {
      logTick("Validating authentic literature and reference citations...", "text-emerald-400");
      updateStepUI(4, 85);
      if (sText) sText.textContent = "Synthesizing bibliography...";
    }, 1700);

    try {
      const assignment = await apiPromise;
      
      // Step 7: Completed
      logTick("Assignment compilation complete! Launching editor...", "text-emerald-400 font-bold");
      updateStepUI(6, 100);
      if (sText) sText.textContent = "Complete!";

      window.appState.set("activeAssignment", assignment);
      UI.showToast("Assignment generated successfully!", "success");

      // Redirect to assignment editor after brief pause
      setTimeout(() => {
        router.navigate("editor", { id: assignment.id });
      }, 700);

    } catch (err) {
      logTick(`ERROR: ${err.message}`, "text-rose-400 font-bold");
      if (sText) sText.textContent = "Generation failed";
      UI.showToast("Generation failed: " + err.message, "error");
      
      setTimeout(() => {
        router.navigate("create");
      }, 2500);
    }
  }
};

window.GeneratingPage = GeneratingPage;
