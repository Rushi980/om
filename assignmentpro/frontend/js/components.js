/**
 * AssignmentPro UI Components
 * Modals, Toasts, Header, and Reusable UI Helpers.
 */

const UI = {
  // --- Toast Notifications ---
  showToast(message, type = "success") {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    const bgColors = {
      success: "bg-emerald-600 text-white",
      error: "bg-rose-600 text-white",
      info: "bg-blue-600 text-white",
      warning: "bg-amber-600 text-white"
    };

    const icons = {
      success: '<i data-lucide="check-circle-2" class="w-5 h-5 flex-shrink-0"></i>',
      error: '<i data-lucide="alert-circle" class="w-5 h-5 flex-shrink-0"></i>',
      info: '<i data-lucide="info" class="w-5 h-5 flex-shrink-0"></i>',
      warning: '<i data-lucide="alert-triangle" class="w-5 h-5 flex-shrink-0"></i>'
    };

    toast.className = `flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl transition-all duration-300 transform translate-y-2 opacity-0 text-sm font-medium ${bgColors[type] || bgColors.info}`;
    toast.innerHTML = `
      ${icons[type] || icons.info}
      <span class="flex-1">${message}</span>
      <button class="opacity-70 hover:opacity-100 transition-opacity ml-2" onclick="this.parentElement.remove()">
        <i data-lucide="x" class="w-4 h-4"></i>
      </button>
    `;

    container.appendChild(toast);
    if (window.lucide) window.lucide.createIcons();

    // Trigger animation
    setTimeout(() => {
      toast.classList.remove("translate-y-2", "opacity-0");
    }, 10);

    // Auto dismiss after 4 seconds
    setTimeout(() => {
      toast.classList.add("opacity-0", "translate-y-2");
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  },

  // --- Modal Dialogs ---
  openModal(title, bodyHtml, footerHtml = "") {
    const backdrop = document.getElementById("modal-backdrop");
    const container = document.getElementById("modal-container");
    const modalTitle = document.getElementById("modal-title");
    const modalBody = document.getElementById("modal-body");
    const modalFooter = document.getElementById("modal-footer");

    if (!backdrop || !container) return;

    modalTitle.textContent = title;
    modalBody.innerHTML = bodyHtml;
    modalFooter.innerHTML = footerHtml || `
      <button onclick="UI.closeModal()" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-colors">
        Close
      </button>
    `;

    backdrop.classList.remove("hidden");
    container.classList.remove("hidden");
    if (window.lucide) window.lucide.createIcons();
  },

  closeModal() {
    const backdrop = document.getElementById("modal-backdrop");
    const container = document.getElementById("modal-container");
    if (backdrop && container) {
      backdrop.classList.add("hidden");
      container.classList.add("hidden");
    }
  },

  // --- Render Navigation Bar ---
  renderNavbar() {
    const nav = document.getElementById("main-nav");
    if (!nav) return;

    const user = window.appState.get("user");
    const currentPage = window.appState.get("currentPage");

    if (!user) {
      // Public Navbar (for Landing & Auth)
      nav.innerHTML = `
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div class="flex items-center gap-3 cursor-pointer" onclick="router.navigate('landing')">
            <div class="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <i data-lucide="graduation-cap" class="w-6 h-6"></i>
            </div>
            <div>
              <span class="text-xl font-bold tracking-tight text-slate-900">Assignment<span class="text-blue-600">Pro</span></span>
              <span class="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full border border-blue-200">Academic AI</span>
            </div>
          </div>
          
          <div class="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" class="hover:text-blue-600 transition-colors">Features</a>
            <a href="#how-it-works" class="hover:text-blue-600 transition-colors">How It Works</a>
            <a href="#formats" class="hover:text-blue-600 transition-colors">Formats</a>
            <a href="#faq" class="hover:text-blue-600 transition-colors">FAQ</a>
          </div>

          <div class="flex items-center gap-3">
            <button onclick="router.navigate('auth', { mode: 'login' })" class="px-4 py-2 text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors">
              Sign In
            </button>
            <button onclick="router.navigate('auth', { mode: 'register' })" class="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm shadow-blue-500/20 transition-all flex items-center gap-1.5">
              <span>Get Started Free</span>
              <i data-lucide="arrow-right" class="w-4 h-4"></i>
            </button>
          </div>
        </div>
      `;
    } else {
      // Authenticated Dashboard Navbar
      const isAdmin = user.role === "admin";
      nav.innerHTML = `
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div class="flex items-center gap-3 cursor-pointer" onclick="router.navigate('dashboard')">
            <div class="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20">
              <i data-lucide="graduation-cap" class="w-5 h-5"></i>
            </div>
            <span class="text-lg font-bold tracking-tight text-slate-900">Assignment<span class="text-blue-600">Pro</span></span>
          </div>

          <!-- Desktop App Nav Links -->
          <div class="hidden lg:flex items-center gap-1">
            <button onclick="router.navigate('dashboard')" class="px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${currentPage === 'dashboard' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-100'}">
              Dashboard
            </button>
            <button onclick="router.navigate('create')" class="px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${currentPage === 'create' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-100'}">
              + Create Assignment
            </button>
            <button onclick="router.navigate('my_assignments')" class="px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${currentPage === 'my_assignments' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-100'}">
              My Assignments
            </button>
            <button onclick="router.navigate('guidelines')" class="px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${currentPage === 'guidelines' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-100'}">
              Guideline Inspector
            </button>
            ${isAdmin ? `
              <button onclick="router.navigate('admin')" class="px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${currentPage === 'admin' ? 'bg-purple-50 text-purple-700 font-semibold' : 'text-purple-600 hover:bg-purple-50'}">
                <i data-lucide="shield-check" class="w-3.5 h-3.5 inline mr-1"></i>Admin Portal
              </button>
            ` : ''}
          </div>

          <!-- User Menu & Actions -->
          <div class="flex items-center gap-3">
            <button onclick="router.navigate('create')" class="hidden sm:flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm shadow-blue-500/20 transition-all">
              <i data-lucide="plus" class="w-3.5 h-3.5"></i>
              <span>New Assignment</span>
            </button>

            <!-- User Avatar & Dropdown -->
            <div class="relative group">
              <button class="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 transition-colors">
                <div class="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs uppercase border border-blue-200">
                  ${user.full_name ? user.full_name.slice(0, 2) : "ST"}
                </div>
                <div class="hidden sm:block text-left text-xs">
                  <div class="font-semibold text-slate-800 leading-tight">${user.full_name}</div>
                  <div class="text-slate-500 capitalize text-[10px]">${user.role}</div>
                </div>
                <i data-lucide="chevron-down" class="w-3.5 h-3.5 text-slate-400"></i>
              </button>
              
              <!-- Dropdown Menu -->
              <div class="absolute right-0 mt-1 w-52 bg-white rounded-xl shadow-lg border border-slate-200 py-1 hidden group-hover:block hover:block z-50">
                <div class="px-4 py-2 border-b border-slate-100">
                  <div class="text-xs font-semibold text-slate-800">${user.full_name}</div>
                  <div class="text-[11px] text-slate-500 truncate">${user.email}</div>
                  <div class="text-[10px] text-blue-600 font-medium truncate mt-0.5">${user.college_name || 'College Student'}</div>
                </div>
                <a onclick="router.navigate('dashboard')" class="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 cursor-pointer">
                  <i data-lucide="layout-dashboard" class="w-3.5 h-3.5"></i> Student Dashboard
                </a>
                <a onclick="router.navigate('my_assignments')" class="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 cursor-pointer">
                  <i data-lucide="file-text" class="w-3.5 h-3.5"></i> My Assignments
                </a>
                <a onclick="router.navigate('profile')" class="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 cursor-pointer">
                  <i data-lucide="user" class="w-3.5 h-3.5"></i> College Profile & Presets
                </a>
                ${isAdmin ? `
                  <a onclick="router.navigate('admin')" class="flex items-center gap-2 px-4 py-2 text-xs text-purple-700 hover:bg-purple-50 cursor-pointer font-medium">
                    <i data-lucide="shield" class="w-3.5 h-3.5"></i> Admin Dashboard
                  </a>
                ` : ''}
                <div class="border-t border-slate-100 my-1"></div>
                <a onclick="window.appActions.logout()" class="flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 cursor-pointer">
                  <i data-lucide="log-out" class="w-3.5 h-3.5"></i> Sign Out
                </a>
              </div>
            </div>

            <!-- Mobile Menu Toggle -->
            <button onclick="UI.toggleMobileMenu()" class="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100">
              <i data-lucide="menu" class="w-5 h-5"></i>
            </button>
          </div>
        </div>

        <!-- Mobile Drawer -->
        <div id="mobile-menu" class="lg:hidden hidden px-4 pt-2 pb-4 border-t border-slate-100 bg-white space-y-1 text-sm">
          <a onclick="router.navigate('dashboard')" class="block px-3 py-2 rounded-lg text-slate-700 font-medium hover:bg-slate-50">Dashboard</a>
          <a onclick="router.navigate('create')" class="block px-3 py-2 rounded-lg text-blue-700 font-semibold hover:bg-blue-50">+ Create Assignment</a>
          <a onclick="router.navigate('my_assignments')" class="block px-3 py-2 rounded-lg text-slate-700 font-medium hover:bg-slate-50">My Assignments</a>
          <a onclick="router.navigate('guidelines')" class="block px-3 py-2 rounded-lg text-slate-700 font-medium hover:bg-slate-50">Guideline Inspector</a>
          <a onclick="router.navigate('profile')" class="block px-3 py-2 rounded-lg text-slate-700 font-medium hover:bg-slate-50">College Profile</a>
          ${isAdmin ? `<a onclick="router.navigate('admin')" class="block px-3 py-2 rounded-lg text-purple-700 font-semibold hover:bg-purple-50">Admin Portal</a>` : ''}
          <div class="border-t border-slate-100 pt-2">
            <button onclick="window.appActions.logout()" class="w-full text-left px-3 py-2 rounded-lg text-rose-600 font-medium hover:bg-rose-50">
              Sign Out
            </button>
          </div>
        </div>
      `;
    }

    if (window.lucide) window.lucide.createIcons();
  },

  toggleMobileMenu() {
    const m = document.getElementById("mobile-menu");
    if (m) m.classList.toggle("hidden");
  }
};

window.UI = UI;
