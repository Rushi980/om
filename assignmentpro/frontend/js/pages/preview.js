/**
 * AssignmentPro Document Preview Page
 * Realistic A4 page-by-page visualizer showing Title Page, TOC, Sections, and References.
 */

const PreviewPage = {
  assignment: null,

  async render(params = {}) {
    let assignment = window.appState.get("activeAssignment");
    const id = params.id;

    if (!assignment || (id && assignment.id != id)) {
      try {
        assignment = await window.api.getAssignment(id);
        window.appState.set("activeAssignment", assignment);
      } catch (err) {
        UI.showToast("Could not load preview: " + err.message, "error");
        router.navigate("dashboard");
        return `<div>Loading...</div>`;
      }
    }

    this.assignment = assignment;
    const cover = assignment.cover_page || {};
    const sections = assignment.sections || [];
    const references = assignment.references || [];

    // Calculate TOC estimated pages
    let runningPage = 2;
    const tocItems = sections.map((s, idx) => {
      const pageNum = runningPage;
      const wCount = s.content ? s.content.split(/\s+/).length : 0;
      runningPage += Math.max(1, Math.round(wCount / 320));
      return { title: s.title, page: pageNum };
    });
    const refPage = runningPage;

    return `
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        <!-- Preview Control Bar (Hidden when printing) -->
        <div class="no-print bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-20 z-40">
          <div class="flex items-center gap-3">
            <button onclick="router.navigate('editor', { id: ${assignment.id} })" class="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors" title="Back to Editor">
              <i data-lucide="arrow-left" class="w-4 h-4"></i>
            </button>
            <div>
              <div class="font-bold text-slate-900 text-sm truncate max-w-sm sm:max-w-md">${assignment.title}</div>
              <div class="text-[11px] text-slate-500">${assignment.actual_words.toLocaleString()} words &bull; ${assignment.citation_style} &bull; ${assignment.font_style} (${assignment.line_spacing}x)</div>
            </div>
          </div>

          <div class="flex items-center gap-2 flex-wrap">
            <button onclick="window.print()" class="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5">
              <i data-lucide="printer" class="w-3.5 h-3.5"></i>
              <span>Print</span>
            </button>
            <button onclick="window.api.triggerDownload(${assignment.id}, 'docx')" class="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5">
              <i data-lucide="file-down" class="w-3.5 h-3.5"></i>
              <span>Download DOCX</span>
            </button>
            <button onclick="window.api.triggerDownload(${assignment.id}, 'pdf')" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all flex items-center gap-1.5">
              <i data-lucide="download" class="w-3.5 h-3.5"></i>
              <span>Download PDF</span>
            </button>
          </div>
        </div>

        <!-- Realistic A4 Paper Stack -->
        <div class="space-y-8" id="printable-document">
          
          <!-- PAGE 1: OFFICIAL COLLEGE COVER PAGE -->
          <div class="a4-page flex flex-col justify-between font-academic text-slate-900 border-t-8 border-t-blue-900">
            <!-- Institution Header -->
            <div class="text-center pt-8 space-y-2">
              <div class="text-xl font-bold uppercase tracking-wider text-blue-900">
                ${cover.college_name || "COLLEGE OF HIGHER EDUCATION"}
              </div>
              ${cover.university_name ? `<div class="text-sm font-sans font-medium text-slate-600">${cover.university_name}</div>` : ''}
              <div class="text-xs font-sans text-slate-500">
                ${cover.department || "Academic Department"} &bull; ${cover.course || "Degree Program"}
              </div>
              <div class="w-24 h-0.5 bg-blue-900 mx-auto mt-4"></div>
            </div>

            <!-- Title & Topic Block -->
            <div class="text-center py-12 px-6 space-y-4">
              <div class="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
                ${assignment.title}
              </div>
              <div class="text-sm font-sans text-slate-600 max-w-lg mx-auto">
                A formal academic assignment submitted for the course <br />
                <span class="font-semibold text-slate-800">${assignment.subject}</span>
              </div>
              <div class="inline-block px-3 py-1 bg-slate-100 rounded-full font-sans text-xs text-slate-600 font-medium border border-slate-200">
                Format: ${assignment.format_type}
              </div>
            </div>

            <!-- Bottom Metadata Table: Submitted By & Submitted To -->
            <div class="font-sans text-xs pb-6">
              <div class="grid grid-cols-2 gap-8 p-6 bg-slate-50 rounded-xl border border-slate-200">
                <div class="space-y-1.5">
                  <div class="font-bold text-[10px] text-slate-400 uppercase tracking-wider">Submitted By</div>
                  <div class="font-bold text-slate-900 text-sm">${cover.student_name || "Student Scholar"}</div>
                  <div class="text-slate-600">Roll/Reg No: <span class="font-mono font-semibold">${cover.student_roll_no || "REG-2026-001"}</span></div>
                  <div class="text-slate-600">Semester: ${cover.semester || "Semester VI"}</div>
                  <div class="text-slate-600">Academic Year: ${cover.academic_year || "2026-2027"}</div>
                </div>

                <div class="space-y-1.5">
                  <div class="font-bold text-[10px] text-slate-400 uppercase tracking-wider">Submitted To</div>
                  <div class="font-bold text-slate-900 text-sm">${cover.instructor_name || "Course Instructor / Department Chair"}</div>
                  <div class="text-slate-600">Department: ${cover.department || "Academic Faculty"}</div>
                  <div class="text-slate-600">Citation Style: <span class="font-semibold text-blue-800">${assignment.citation_style}</span></div>
                  <div class="text-slate-600">Submission Date: ${cover.submission_date || "November 2026"}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- PAGE 2: TABLE OF CONTENTS -->
          <div class="a4-page font-academic text-slate-900 space-y-6">
            <!-- Header -->
            <div class="flex items-center justify-between text-[10px] font-sans text-slate-400 border-b border-slate-200 pb-2">
              <span>${assignment.title.slice(0, 50)}...</span>
              <span>Table of Contents</span>
            </div>

            <div class="pt-4">
              <h2 class="text-lg font-bold text-blue-900 uppercase tracking-wider border-b-2 border-blue-900 pb-2 mb-6">
                Table of Contents
              </h2>

              <div class="space-y-3 font-sans text-xs">
                ${tocItems.map(item => `
                  <div class="flex items-center justify-between">
                    <span class="font-medium text-slate-800">${item.title}</span>
                    <div class="toc-dots"></div>
                    <span class="font-mono font-bold text-slate-600">${item.page}</span>
                  </div>
                `).join('')}

                <div class="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span class="font-bold text-blue-900">References & Academic Bibliography</span>
                  <div class="toc-dots"></div>
                  <span class="font-mono font-bold text-slate-600">${refPage}</span>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div class="absolute bottom-6 left-8 right-8 flex items-center justify-between text-[10px] font-sans text-slate-400 border-t border-slate-200 pt-2">
              <span>AssignmentPro Academic Document</span>
              <span>Page 2</span>
            </div>
          </div>

          <!-- PAGE 3+: BODY SECTIONS -->
          <div class="a4-page font-academic text-slate-900 space-y-8 relative">
            <!-- Running Header -->
            <div class="flex items-center justify-between text-[10px] font-sans text-slate-400 border-b border-slate-200 pb-2">
              <span>${cover.college_name || "Academic Document"}</span>
              <span>${assignment.subject}</span>
            </div>

            <div class="space-y-6">
              ${sections.map(sec => `
                <div class="space-y-3">
                  <h3 class="text-base font-bold text-blue-900 font-sans border-b border-slate-200 pb-1 pt-2">
                    ${sec.title}
                  </h3>
                  <div class="text-xs sm:text-sm text-slate-800 leading-relaxed space-y-3">
                    ${(sec.content || '').split("\n\n").map(para => `
                      <p class="indent-6 text-justify">${para.trim()}</p>
                    `).join('')}
                  </div>

                  <!-- Tabulated Tables -->
                  ${(sec.tables && sec.tables.length > 0) ? `
                    <div class="my-4 space-y-2">
                      ${sec.tables.map(tbl => `
                        <div class="text-[11px] font-bold text-slate-700 italic font-sans">${tbl.caption}</div>
                        <div class="border border-slate-300 rounded overflow-hidden">
                          <table class="w-full text-left text-[10px] font-sans">
                            <thead class="bg-blue-900 text-white font-semibold">
                              <tr>
                                ${tbl.headers.map(h => `<th class="p-2 border-r border-blue-800 last:border-none">${h}</th>`).join('')}
                              </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-200 text-slate-800">
                              ${tbl.rows.map((r, i) => `
                                <tr class="${i % 2 === 1 ? 'bg-slate-50' : 'bg-white'}">
                                  ${r.map(c => `<td class="p-2 border-r border-slate-200 last:border-none">${c}</td>`).join('')}
                                </tr>
                              `).join('')}
                            </tbody>
                          </table>
                        </div>
                      `).join('')}
                    </div>
                  ` : ''}
                </div>
              `).join('')}
            </div>

            <!-- Footer -->
            <div class="mt-12 flex items-center justify-between text-[10px] font-sans text-slate-400 border-t border-slate-200 pt-2">
              <span>AssignmentPro &bull; ${assignment.citation_style}</span>
              <span>Page 3</span>
            </div>
          </div>

          <!-- FINAL PAGE: REFERENCES & BIBLIOGRAPHY -->
          <div class="a4-page font-academic text-slate-900 space-y-6 relative">
            <div class="flex items-center justify-between text-[10px] font-sans text-slate-400 border-b border-slate-200 pb-2">
              <span>${assignment.title.slice(0, 50)}...</span>
              <span>References</span>
            </div>

            <div class="space-y-4">
              <h2 class="text-lg font-bold text-blue-900 uppercase tracking-wider border-b-2 border-blue-900 pb-2">
                References & Academic Bibliography
              </h2>
              <div class="text-[11px] font-sans text-slate-500 mb-2">
                Referencing Standard: <span class="font-bold text-slate-800">${assignment.citation_style}</span> &bull; Verified Authentic Academic Sources
              </div>

              <div class="space-y-3 font-academic text-xs text-slate-800">
                ${references.map(r => `
                  <div class="pl-6 -indent-6 leading-relaxed">
                    ${r.citation || str(r)}
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Footer -->
            <div class="absolute bottom-6 left-8 right-8 flex items-center justify-between text-[10px] font-sans text-slate-400 border-t border-slate-200 pt-2">
              <span>AssignmentPro Academic Document</span>
              <span>References Page</span>
            </div>
          </div>

        </div>

      </div>
    `;
  }
};

window.PreviewPage = PreviewPage;
