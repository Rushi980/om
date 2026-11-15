"""
AssignmentPro - Smart College Assignment Generator Launcher.
Starts the FastAPI server with uvicorn and opens the web application in your browser.
"""

import sys
import os
import time
import webbrowser
import threading
from pathlib import Path

# Configure utf-8 encoding for Windows consoles
if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

PROJECT_ROOT = Path(__file__).resolve().parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))


def run_automated_tests():
    """Verify all backend APIs, AI generation, DB persistence, and exporters."""
    print("=" * 65)
    print(" [AssignmentPro] Running Automated System Verification Tests...")
    print("=" * 65)
    
    from fastapi.testclient import TestClient
    from backend.main import app

    with TestClient(app) as client:
        # 1. Health check
        resp = client.get("/api/health")
        assert resp.status_code == 200, f"Health check failed: {resp.text}"
        print(" [x] 1. Health check passed:", resp.json()["status"])

        # 2. Assignment Templates
        resp = client.get("/api/templates")
        assert resp.status_code == 200
        templates = resp.json()
        assert len(templates) >= 5, "Expected at least 5 default templates"
        print(f" [x] 2. Templates verified: Found {len(templates)} templates ({templates[0]['category']})")

        # 3. Student Login (Demo account)
        resp = client.post("/api/auth/login", json={
            "email": "student@assignmentpro.edu",
            "password": "StudentPassword2026!"
        })
        assert resp.status_code == 200, f"Student login failed: {resp.text}"
        student_token = resp.json()["access_token"]
        student_headers = {"Authorization": f"Bearer {student_token}"}
        print(" [x] 3. Student authentication passed (JWT token issued)")

        # 4. Guidelines Parser
        sample_guide = "All assignments must be 1500 words, formatted in Times New Roman 12pt, double spaced, APA 7th edition referencing. Sections must include Introduction, Literature Review, Methodology, Analysis, and Conclusion."
        resp = client.post("/api/guidelines/parse-text", json={"raw_text": sample_guide})
        assert resp.status_code == 200
        insights = resp.json()["insights"]
        assert insights["detected_word_count"] == 1500
        assert insights["detected_citation"] == "APA 7th"
        print(f" [x] 4. Guidelines parsed successfully: {insights['summary']}")

        # 5. AI Assignment Generation
        gen_payload = {
            "college_name": "MIT School of Engineering",
            "university_name": "Massachusetts Institute of Technology",
            "department": "Electrical Engineering & Computer Science",
            "course": "M.Eng in Artificial Intelligence",
            "semester": "Semester II",
            "academic_year": "2026-2027",
            "instructor_name": "Prof. Leslie Kaelbling",
            "student_roll_no": "MIT-EECS-9941",
            "subject": "Deep Learning Systems",
            "topic": "Transformer Attention Mechanisms and Computational Efficiency",
            "title": "Architectural Innovations in Transformer Self-Attention: A Quantitative Evaluation",
            "target_pages": 4,
            "target_words": 1200,
            "font_style": "Times New Roman",
            "font_size": 12,
            "line_spacing": 1.5,
            "page_margins": "1 inch (2.54 cm)",
            "citation_style": "IEEE",
            "format_type": "Technical assignment",
            "guidelines_text": sample_guide
        }
        resp = client.post("/api/assignments/generate", json=gen_payload, headers=student_headers)
        assert resp.status_code == 200, f"Generation failed: {resp.text}"
        assignment = resp.json()
        assignment_id = assignment["id"]
        print(f" [x] 5. Assignment generated: '{assignment['title'][:45]}...' ({assignment['actual_words']} words, {len(assignment['sections'])} sections)")

        # 6. Section Regeneration
        sec_to_regen = assignment["sections"][0]
        resp = client.post(
            f"/api/assignments/{assignment_id}/regenerate-section",
            json={
                "section_id": sec_to_regen["id"],
                "section_title": sec_to_regen["title"],
                "current_content": sec_to_regen["content"],
                "instruction": "expand",
                "assignment_topic": assignment["topic"],
                "citation_style": "IEEE"
            },
            headers=student_headers
        )
        assert resp.status_code == 200
        print(" [x] 6. Section regeneration verified: AI assistive edit tool functional")

        # 7. Document Exporters (DOCX, PDF, TXT)
        resp_docx = client.get(f"/api/assignments/{assignment_id}/export/docx", headers=student_headers)
        assert resp_docx.status_code == 200, "DOCX export failed"
        assert len(resp_docx.content) > 1000
        print(f" [x] 7a. DOCX export verified ({len(resp_docx.content)} bytes)")

        resp_pdf = client.get(f"/api/assignments/{assignment_id}/export/pdf", headers=student_headers)
        assert resp_pdf.status_code == 200, "PDF export failed"
        assert len(resp_pdf.content) > 1000
        print(f" [x] 7b. PDF export verified ({len(resp_pdf.content)} bytes)")

        resp_txt = client.get(f"/api/assignments/{assignment_id}/export/txt", headers=student_headers)
        assert resp_txt.status_code == 200, "TXT export failed"
        assert len(resp_txt.content) > 500
        print(f" [x] 7c. TXT export verified ({len(resp_txt.content)} bytes)")

        # 8. Admin Auth & Metrics
        admin_login = client.post("/api/auth/login", json={
            "email": "admin@assignmentpro.edu",
            "password": "AdminPassword2026!"
        })
        assert admin_login.status_code == 200
        admin_token = admin_login.json()["access_token"]
        admin_headers = {"Authorization": f"Bearer {admin_token}"}
        
        admin_stats = client.get("/api/admin/stats", headers=admin_headers)
        assert admin_stats.status_code == 200
        print(f" [x] 8. Admin portal verified: {admin_stats.json()['total_users']} users, {admin_stats.json()['total_assignments']} total assignments")

        # 9. Frontend SPA & Static Assets Serving
        resp_index = client.get("/")
        assert resp_index.status_code == 200, f"Frontend index failed: {resp_index.status_code}"
        assert "AssignmentPro" in resp_index.text
        print(" [x] 9a. Frontend SPA index page verified")

        resp_css = client.get("/static/css/style.css")
        assert resp_css.status_code == 200, f"CSS static asset failed: {resp_css.status_code}"
        print(" [x] 9b. Static CSS stylesheet verified")

        resp_js = client.get("/static/js/app.js")
        assert resp_js.status_code == 200, f"JS static asset failed: {resp_js.status_code}"
        print(" [x] 9c. JavaScript client application verified")

    print("=" * 65)
    print(" [SUCCESS] ALL SYSTEM VERIFICATION TESTS PASSED PERFECTLY!")
    print("=" * 65)


def open_browser(url: str):
    time.sleep(1.2)
    print(f"\n[AssignmentPro] Opening browser at {url} ...")
    webbrowser.open(url)


if __name__ == "__main__":
    import uvicorn
    
    # Run automated test suite
    run_automated_tests()
    
    port = int(os.environ.get("PORT", 8000))
    host = "127.0.0.1"
    url = f"http://{host}:{port}"
    
    # Launch browser in background thread
    threading.Thread(target=open_browser, args=(url,), daemon=True).start()
    
    print(f"\nStarting AssignmentPro Web Application on {url}")
    print("Press Ctrl+C to stop the server.\n")
    
    uvicorn.run("backend.main:app", host=host, port=port, log_level="info", reload=False)
