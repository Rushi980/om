# AssignmentPro – Smart College Assignment Generator

An intelligent, modern, AI-powered web platform designed to help college and university students generate structured, academically rigorous, and editable college assignments adhering strictly to institutional requirements, syllabi, and citation guidelines.

---

## 🌟 Key Features

1. **AI-Powered Guideline Understanding**
   - Upload college assignment syllabi or guidelines in **PDF, DOCX, or TXT** format.
   - Automatically detects target word count, required page count, font rules, line spacing, margins, and mandatory section headings (Abstract, Introduction, Theoretical Framework, Methodology, Results, Discussion, Conclusion).

2. **7 Standard Academic Formats & Blueprints**
   - **Standard College Assignment**: Introduction, Objectives, Theoretical Framework, Core Analysis, Practical Implications, Conclusion.
   - **University-Specific Assignment**: Syllabus compliance, Methodological Survey, Subject Exposition, Analytical Synthesis.
   - **Empirical Research Paper**: Abstract, Problem Statement, Hypotheses, Methodology, Data Analysis, Limitations.
   - **Technical & Engineering Assignment**: Technical Overview, System Architecture, Algorithm Workflow, Performance Metrics, Benchmarks, Security.
   - **Laboratory & Practical Journal**: Aim, Apparatus & Specifications, Experimental Protocol, Observations & Tabulated Data, Error Calculations, Inferences.
   - **Business Case Study**: Executive Summary, Strategic Dilemmas, SWOT/PESTLE Matrix, Strategic Options, Action Plan & ROI.
   - **Software Project Documentation**: Project Charter, SRS Specifications, Modular Design, QA Validation, Deployment & User Manual.

3. **Authentic, Non-Hallucinated Citations**
   - Never invents fake citations, imaginary papers, or hallucinatory authors.
   - Employs landmark, peer-reviewed standard literature and university textbooks formatted in **APA 7th, IEEE, MLA 9th, Harvard, or Chicago**.

4. **Multi-Provider AI Architecture**
   - **Built-in High-Rigor Academic Engine**: Deterministic, domain-specific generator that runs locally without requiring an API key.
   - **Google Gemini API Support**: Optionally plug in a `GEMINI_API_KEY` for multi-modal synthesis.
   - **OpenAI API Support**: Compatible with OpenAI models via `OPENAI_API_KEY`.

5. **Interactive Section Editor & AI Assistive Tools**
   - Edit, reorder, add, or delete individual chapters.
   - **Expand (+200 words)**: Enhances technical depth and contextual examples.
   - **Condense / Shorten**: Synthesizes core arguments into concise summaries.
   - **Elevate Formal Tone**: Enriches scholarly vocabulary and active/passive voice balance.
   - **Fix Grammar & Flow**: Cleans syntax, transitions, and punctuation.
   - **Insert Tabulated Data**: Generates comparative empirical matrices with headers and data rows.
   - **Custom AI Prompt**: Direct custom rewrites per section.
   - Live word count & estimated page count tracker.
   - Real-time auto-saving with version history.

6. **True A4 Academic Visualizer & Preview**
   - Official College Title Page with institution banner, assignment title, subject, student roll number, professor credentials, and submission date.
   - Automatic Table of Contents with dotted leader lines and page numbers.
   - Running headers and "Page X of Y" footers.

7. **Multi-Format Export**
   - **Microsoft Word (.docx)**: Styled headings, 1-inch margins, 1.5 line spacing, structured tables, and cover page.
   - **Publication-Ready PDF (.pdf)**: Rendered via ReportLab with running headers, page numbers, and borders.
   - **Plain Text (.txt)**: Clean plain text for copy-pasting.

8. **User & Institutional Management**
   - Student Dashboard with analytics (words written, assignments count, format distributions).
   - Saved College Profiles (save college name, department, roll number, and font preferences once to auto-fill future assignments).
   - Admin Console (track registered users, assignment volumes, template catalog, platform configuration).
   - 1-Click Demo Accounts for instant evaluation.

---

## 🛠️ Technology Stack

- **Backend**: Python 3.10+ / 3.14, FastAPI, Uvicorn, SQLAlchemy 2.0, SQLite
- **Security & Auth**: JWT (PyJWT), Bcrypt password hashing
- **Document Processing**: `python-docx` (Word), `reportlab` (PDF), `pypdf` (PDF extraction)
- **Frontend**: HTML5, Tailwind CSS, Lucide Icons, Modern JavaScript (Single Page Architecture, Responsive across Mobile, Tablet, Desktop)

---

## 🚀 Quick Start Guide

### 1. Launch with One Click (Windows)
Double-click `start.bat` in the project directory, or run:

```powershell
python run.py
```

The launcher will automatically execute self-diagnostic tests and launch the web interface at `http://127.0.0.1:8000`.

### 2. Demo User Credentials
You can use the **1-Click Demo Buttons** on the sign-in page, or log in manually:

- **Student Account**:
  - Email: `student@assignmentpro.edu`
  - Password: `StudentPassword2026!`
- **Administrator Account**:
  - Email: `admin@assignmentpro.edu`
  - Password: `AdminPassword2026!`

---

## 📁 Project Architecture

```
assignmentpro/
├── backend/
│   ├── config.py             # Config & environment paths
│   ├── database.py           # SQLite SQLAlchemy models & sessions
│   ├── auth.py               # Password hashing & JWT dependencies
│   ├── schemas.py            # Pydantic request & response models
│   ├── ai_engine.py          # Unified AI engine (Gemini, OpenAI, Built-in)
│   ├── doc_extractor.py      # PDF, DOCX, TXT guideline extractor
│   ├── exporters.py          # PDF (ReportLab) & DOCX (python-docx) exporters
│   ├── seed_data.py          # Seed templates, admin, demo student, samples
│   └── main.py               # FastAPI routers & static file mounting
├── frontend/
│   ├── index.html            # Single Page Application container
│   ├── css/
│   │   └── style.css         # Modern academic typography & A4 styles
│   └── js/
│       ├── api.js            # REST API client
│       ├── state.js          # Reactive state store
│       ├── components.js     # UI components (modal, toast, navbar)
│       ├── pages/
│       │   ├── landing.js    # SaaS Landing page
│       │   ├── auth.js       # Register / Login / 1-Click Demo
│       │   ├── dashboard.js  # Student dashboard & metrics
│       │   ├── create.js     # 4-step assignment creation wizard
│       │   ├── guidelines.js # Guideline inspector & rule parser
│       │   ├── generating.js # AI generation screen with live ticker
│       │   ├── editor.js     # Interactive section editor & AI tools
│       │   ├── preview.js    # Realistic A4 paginated preview
│       │   ├── my_assignments.js # Library with search & filters
│       │   ├── profile.js    # Student profile & saved presets
│       │   └── admin.js      # Admin dashboard & platform settings
│       └── app.js            # Application router & bootstrap
├── uploads/                  # Uploaded guideline documents
├── exports/                  # Generated PDF, DOCX, and TXT files
├── requirements.txt          # Python dependencies
├── run.py                    # Server launcher & automated verification suite
├── start.bat                 # Windows one-click launcher
└── README.md                 # Project documentation
```

---

## 📝 API Endpoints Summary

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | System health and AI engine status |
| `POST` | `/api/auth/register` | Register new student or admin |
| `POST` | `/api/auth/login` | Authenticate email/password, issue JWT |
| `GET` | `/api/auth/me` | Current user details |
| `GET` | `/api/templates` | List assignment format templates |
| `POST` | `/api/guidelines/upload` | Upload PDF/DOCX guideline and extract rules |
| `POST` | `/api/guidelines/parse-text` | Parse raw guideline text with AI insights |
| `POST` | `/api/assignments/generate` | Synthesize complete structured assignment |
| `GET` | `/api/assignments` | List assignments (supports search & filter) |
| `GET` | `/api/assignments/{id}` | Single assignment details & sections |
| `PUT` | `/api/assignments/{id}` | Update assignment content & auto-save |
| `POST` | `/api/assignments/{id}/regenerate-section` | AI assist (expand, shorten, formal, grammar, table) |
| `GET` | `/api/assignments/{id}/export/docx` | Download formatted Word (.docx) |
| `GET` | `/api/assignments/{id}/export/pdf` | Download publication-ready PDF (.pdf) |
| `GET` | `/api/assignments/{id}/export/txt` | Download clean plain text (.txt) |
| `GET` | `/api/dashboard/stats` | Student assignment metrics & distribution |
| `GET` | `/api/admin/stats` | System-wide administrator metrics |
| `GET` | `/api/admin/users` | List all registered user accounts |
| `PUT` | `/api/admin/settings` | Update platform configuration |
