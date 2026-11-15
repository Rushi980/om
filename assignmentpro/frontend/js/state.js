/**
 * AssignmentPro State Store
 * Simple, reactive state management with subscriber callbacks.
 */

class StateStore {
  constructor() {
    this.state = {
      user: null,
      isAuthenticated: false,
      currentPage: "landing",
      activeAssignment: null,
      assignments: [],
      templates: [],
      profiles: [],
      dashboardStats: null,
      draftAssignment: {
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
      }
    };
    this.listeners = {};
  }

  get(key) {
    return this.state[key];
  }

  set(key, value) {
    this.state[key] = value;
    if (this.listeners[key]) {
      this.listeners[key].forEach(fn => fn(value, this.state));
    }
  }

  update(key, partial) {
    if (typeof this.state[key] === "object" && this.state[key] !== null) {
      this.set(key, { ...this.state[key], ...partial });
    } else {
      this.set(key, partial);
    }
  }

  subscribe(key, fn) {
    if (!this.listeners[key]) {
      this.listeners[key] = [];
    }
    this.listeners[key].push(fn);
    return () => {
      this.listeners[key] = this.listeners[key].filter(listener => listener !== fn);
    };
  }
}

window.appState = new StateStore();
