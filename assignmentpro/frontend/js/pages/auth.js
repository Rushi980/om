/**
 * AssignmentPro Authentication Page
 * Supports Login, Registration, and 1-Click Demo Accounts.
 */

const AuthPage = {
  mode: "login", // "login" or "register"

  render(params = {}) {
    if (params.mode) {
      this.mode = params.mode;
    }

    const isLogin = this.mode === "login";

    return `
      <div class="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full space-y-6">
          
          <!-- Brand Header -->
          <div class="text-center space-y-2">
            <div class="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-md shadow-blue-500/20">
              <i data-lucide="graduation-cap" class="w-7 h-7"></i>
            </div>
            <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              ${isLogin ? "Sign in to your account" : "Create your student account"}
            </h2>
            <p class="text-xs text-slate-500">
              ${isLogin 
                ? "Don't have an account yet? <a onclick=\"AuthPage.switchMode('register')\" class='text-blue-600 font-semibold cursor-pointer hover:underline'>Register free</a>"
                : "Already registered? <a onclick=\"AuthPage.switchMode('login')\" class='text-blue-600 font-semibold cursor-pointer hover:underline'>Sign in</a>"
              }
            </p>
          </div>

          <!-- Quick 1-Click Demo Access Box -->
          <div class="p-4 rounded-xl bg-blue-50/80 border border-blue-200/80 text-center space-y-2.5">
            <div class="text-xs font-semibold text-blue-900 flex items-center justify-center gap-1.5">
              <i data-lucide="sparkles" class="w-3.5 h-3.5 text-blue-600"></i>
              <span>Instant 1-Click Demo Accounts</span>
            </div>
            <div class="grid grid-cols-2 gap-2 text-xs">
              <button type="button" onclick="window.appActions.loginDemoStudent()" class="px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 font-medium rounded-lg border border-slate-200 shadow-sm transition-all flex items-center justify-center gap-1.5">
                <i data-lucide="user" class="w-3.5 h-3.5 text-blue-600"></i>
                <span>Demo Student</span>
              </button>
              <button type="button" onclick="window.appActions.loginDemoAdmin()" class="px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 font-medium rounded-lg border border-slate-200 shadow-sm transition-all flex items-center justify-center gap-1.5">
                <i data-lucide="shield-check" class="w-3.5 h-3.5 text-purple-600"></i>
                <span>Demo Admin</span>
              </button>
            </div>
          </div>

          <!-- Auth Card -->
          <div class="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
            <form id="auth-form" onsubmit="AuthPage.handleSubmit(event)" class="space-y-4">
              
              <!-- Full Name (Only in Register mode) -->
              ${!isLogin ? `
                <div>
                  <label class="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                  <input type="text" id="auth-fullname" required placeholder="Alex Chen" class="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors" />
                </div>
              ` : ''}

              <!-- Email -->
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <input type="email" id="auth-email" required placeholder="student@college.edu" class="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors" />
              </div>

              <!-- Password -->
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                <input type="password" id="auth-password" required minlength="6" placeholder="••••••••" class="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors" />
              </div>

              <!-- Extra Student Fields (Register mode) -->
              ${!isLogin ? `
                <div class="pt-2 border-t border-slate-100 space-y-3">
                  <div class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Academic Profile (Optional)</div>
                  <div class="grid grid-cols-2 gap-3">
                    <div>
                      <label class="block text-[11px] font-medium text-slate-600 mb-1">College Name</label>
                      <input type="text" id="auth-college" placeholder="Stanford Engineering" class="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600" />
                    </div>
                    <div>
                      <label class="block text-[11px] font-medium text-slate-600 mb-1">University Name</label>
                      <input type="text" id="auth-university" placeholder="Stanford University" class="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600" />
                    </div>
                  </div>
                  <div class="grid grid-cols-2 gap-3">
                    <div>
                      <label class="block text-[11px] font-medium text-slate-600 mb-1">Department</label>
                      <input type="text" id="auth-department" placeholder="Computer Science" class="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600" />
                    </div>
                    <div>
                      <label class="block text-[11px] font-medium text-slate-600 mb-1">Student ID / Roll No</label>
                      <input type="text" id="auth-studentid" placeholder="CS-2026-442" class="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600" />
                    </div>
                  </div>
                </div>
              ` : ''}

              <!-- Submit Button -->
              <div class="pt-2">
                <button type="submit" id="auth-submit-btn" class="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2">
                  <span>${isLogin ? "Sign In to AssignmentPro" : "Create Student Account"}</span>
                  <i data-lucide="arrow-right" class="w-4 h-4"></i>
                </button>
              </div>

            </form>
          </div>

        </div>
      </div>
    `;
  },

  switchMode(mode) {
    this.mode = mode;
    router.render();
  },

  async handleSubmit(event) {
    event.preventDefault();
    const btn = document.getElementById("auth-submit-btn");
    const origHtml = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = `<span class="inline-block animate-spin mr-2">&#9696;</span> Authenticating...`;

    const email = document.getElementById("auth-email").value.trim();
    const password = document.getElementById("auth-password").value;

    try {
      if (this.mode === "login") {
        const res = await window.api.login(email, password);
        window.appState.set("user", res.user);
        window.appState.set("isAuthenticated", true);
        UI.showToast(`Welcome back, ${res.user.full_name}!`, "success");
        router.navigate("dashboard");
      } else {
        const fullName = document.getElementById("auth-fullname").value.trim();
        const college = document.getElementById("auth-college")?.value.trim() || "";
        const university = document.getElementById("auth-university")?.value.trim() || "";
        const department = document.getElementById("auth-department")?.value.trim() || "";
        const studentId = document.getElementById("auth-studentid")?.value.trim() || "";

        const payload = {
          email,
          password,
          full_name: fullName,
          college_name: college,
          university_name: university,
          department: department,
          student_id: studentId,
          role: "student"
        };

        const res = await window.api.register(payload);
        window.appState.set("user", res.user);
        window.appState.set("isAuthenticated", true);
        UI.showToast(`Account created successfully! Welcome, ${res.user.full_name}.`, "success");
        router.navigate("dashboard");
      }
    } catch (err) {
      UI.showToast(err.message, "error");
      btn.disabled = false;
      btn.innerHTML = origHtml;
      if (window.lucide) window.lucide.createIcons();
    }
  }
};

window.AuthPage = AuthPage;
