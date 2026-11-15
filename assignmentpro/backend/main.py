import os
import json
import shutil
from pathlib import Path
from typing import List, Optional
from datetime import datetime

from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, Form, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from sqlalchemy.orm import Session
from sqlalchemy import func

from backend.config import BASE_DIR, UPLOADS_DIR, EXPORTS_DIR, ALLOWED_EXTENSIONS, MAX_FILE_SIZE
from backend.database import (
    init_db, get_db, User, Assignment, AssignmentTemplate, CollegeProfile,
    AssignmentVersion, PlatformSetting
)
from backend.auth import (
    hash_password, verify_password, create_access_token, get_current_user, get_current_admin
)
from backend.schemas import (
    UserRegisterRequest, UserLoginRequest, UserUpdateRequest, CollegeProfileCreate,
    AssignmentCreateRequest, AssignmentUpdateRequest, SectionRegenerateRequest,
    GuidelinesParseRequest, PlatformSettingsUpdate
)
from backend.ai_engine import (
    generate_structured_assignment, regenerate_single_section, FORMAT_BLUEPRINTS
)
from backend.doc_extractor import extract_text_from_file, parse_assignment_guidelines
from backend.exporters import export_to_docx, export_to_pdf, export_to_txt
from backend.seed_data import seed_all

# Initialize FastAPI App
app = FastAPI(
    title="AssignmentPro API",
    description="Smart College Assignment Generator REST API Backend",
    version="1.0.0"
)

# Enable CORS for cross-device web browser access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Initialize database and seed templates/defaults on import
init_db()
try:
    _init_db_session = next(get_db())
    seed_all(_init_db_session)
    _init_db_session.close()
except Exception as _e:
    print(f"[AssignmentPro] DB init note: {_e}")


@app.on_event("startup")
def startup_event():
    init_db()
    db = next(get_db())
    try:
        seed_all(db)
    finally:
        db.close()


# ==========================================
# HEALTH & METADATA
# ==========================================
@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "app": "AssignmentPro – Smart College Assignment Generator",
        "version": "1.0.0",
        "timestamp": datetime.utcnow().isoformat(),
        "ai_engine": "Multi-Provider (Built-in Academic Engine, Gemini, OpenAI)"
    }


# ==========================================
# AUTHENTICATION
# ==========================================
@app.post("/api/auth/register")
def register_user(req: UserRegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == req.email.lower()).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists."
        )
    
    new_user = User(
        email=req.email.lower(),
        hashed_password=hash_password(req.password),
        full_name=req.full_name,
        role=req.role if req.role in ["student", "admin"] else "student",
        college_name=req.college_name,
        university_name=req.university_name,
        department=req.department,
        course=req.course,
        student_id=req.student_id,
        preferred_citation=req.preferred_citation or "APA 7th"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Create default college profile if provided
    if req.college_name:
        prof = CollegeProfile(
            user_id=new_user.id,
            profile_name=f"{req.college_name} Default",
            college_name=req.college_name,
            university_name=req.university_name,
            department=req.department,
            course=req.course,
            default_citation=req.preferred_citation or "APA 7th",
            is_default=True
        )
        db.add(prof)
        db.commit()

    token = create_access_token({"sub": str(new_user.id), "email": new_user.email, "role": new_user.role})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": new_user.to_dict()
    }


@app.post("/api/auth/login")
def login_user(req: UserLoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email.lower()).first()
    if not user or not verify_password(req.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )
        
    token = create_access_token({"sub": str(user.id), "email": user.email, "role": user.role})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user.to_dict()
    }


@app.get("/api/auth/me")
def get_current_user_profile(user: User = Depends(get_current_user)):
    return user.to_dict()


@app.put("/api/auth/profile")
def update_profile(req: UserUpdateRequest, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if req.full_name is not None:
        user.full_name = req.full_name
    if req.college_name is not None:
        user.college_name = req.college_name
    if req.university_name is not None:
        user.university_name = req.university_name
    if req.department is not None:
        user.department = req.department
    if req.course is not None:
        user.course = req.course
    if req.student_id is not None:
        user.student_id = req.student_id
    if req.preferred_citation is not None:
        user.preferred_citation = req.preferred_citation
        
    db.commit()
    db.refresh(user)
    return user.to_dict()


# ==========================================
# COLLEGE PROFILES (REUSABLE FORMATS)
# ==========================================
@app.get("/api/profiles")
def get_user_profiles(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profiles = db.query(CollegeProfile).filter(CollegeProfile.user_id == user.id).all()
    return [p.to_dict() for p in profiles]


@app.post("/api/profiles")
def create_user_profile(req: CollegeProfileCreate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if req.is_default:
        db.query(CollegeProfile).filter(CollegeProfile.user_id == user.id).update({"is_default": False})
        
    prof = CollegeProfile(
        user_id=user.id,
        profile_name=req.profile_name,
        college_name=req.college_name,
        university_name=req.university_name,
        department=req.department,
        course=req.course,
        default_font=req.default_font,
        default_font_size=req.default_font_size,
        default_line_spacing=req.default_line_spacing,
        default_margins=req.default_margins,
        default_citation=req.default_citation,
        is_default=req.is_default
    )
    db.add(prof)
    db.commit()
    db.refresh(prof)
    return prof.to_dict()


@app.delete("/api/profiles/{profile_id}")
def delete_user_profile(profile_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    prof = db.query(CollegeProfile).filter(CollegeProfile.id == profile_id, CollegeProfile.user_id == user.id).first()
    if not prof:
        raise HTTPException(status_code=404, detail="Profile not found")
    db.delete(prof)
    db.commit()
    return {"message": "Profile removed"}


# ==========================================
# ASSIGNMENT TEMPLATES
# ==========================================
@app.get("/api/templates")
def list_templates(db: Session = Depends(get_db)):
    templates = db.query(AssignmentTemplate).all()
    return [t.to_dict() for t in templates]


# ==========================================
# GUIDELINES UPLOAD & PARSING
# ==========================================
@app.post("/api/guidelines/upload")
async def upload_guidelines_file(file: UploadFile = File(...), user: User = Depends(get_current_user)):
    file_ext = Path(file.filename).suffix.lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type '{file_ext}'. Allowed formats: {', '.join(ALLOWED_EXTENSIONS)}"
        )
        
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    safe_name = f"{user.id}_{timestamp}_{Path(file.filename).name}"
    save_path = UPLOADS_DIR / safe_name
    
    with open(save_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    extracted_text = extract_text_from_file(save_path)
    insights = parse_assignment_guidelines(extracted_text)
    
    return {
        "filename": file.filename,
        "saved_path": str(save_path.name),
        "extracted_text": extracted_text,
        "insights": insights
    }


@app.post("/api/guidelines/parse-text")
def parse_guidelines_text(req: GuidelinesParseRequest):
    insights = parse_assignment_guidelines(req.raw_text)
    return {
        "insights": insights,
        "summary": insights["summary"]
    }


# ==========================================
# ASSIGNMENT GENERATION & LIFECYCLE
# ==========================================
@app.post("/api/assignments/generate")
def generate_assignment(req: AssignmentCreateRequest, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # 1. Generate assignment content through AI Engine
    generated = generate_structured_assignment(
        topic=req.topic,
        title=req.title,
        subject=req.subject,
        format_type=req.format_type,
        target_words=req.target_words,
        target_pages=req.target_pages,
        college_name=req.college_name or user.college_name or "College of Technology",
        university_name=req.university_name or user.university_name or "National University",
        department=req.department or user.department or "Academic Department",
        course=req.course or user.course or "Degree Program",
        instructor_name=req.instructor_name or "Course Faculty",
        student_roll_no=req.student_roll_no or user.student_id or "STU-2026-001",
        semester=req.semester or "Semester VI",
        academic_year=req.academic_year or "2026-2027",
        citation_style=req.citation_style or user.preferred_citation or "APA 7th",
        guidelines_text=req.guidelines_text or ""
    )
    
    # 2. Persist in database
    assignment = Assignment(
        user_id=user.id,
        title=generated["title"],
        topic=generated["topic"],
        subject=generated["subject"],
        college_name=req.college_name or user.college_name,
        university_name=req.university_name or user.university_name,
        department=req.department or user.department,
        course=req.course or user.course,
        semester=req.semester,
        academic_year=req.academic_year,
        instructor_name=req.instructor_name,
        student_roll_no=req.student_roll_no or user.student_id,
        target_pages=req.target_pages,
        target_words=req.target_words,
        font_style=req.font_style,
        font_size=req.font_size,
        line_spacing=req.line_spacing,
        page_margins=req.page_margins,
        citation_style=req.citation_style,
        deadline=req.deadline,
        format_type=req.format_type,
        template_id=req.template_id,
        guidelines_text=req.guidelines_text,
        status="completed",
        structured_content=json.dumps(generated["sections"]),
        full_text=generated["full_text"],
        cover_page_json=json.dumps(generated["cover_page"]),
        references_json=json.dumps(generated["references"]),
        actual_words=generated["actual_words"],
        estimated_pages=generated["estimated_pages"],
    )
    db.add(assignment)
    db.commit()
    db.refresh(assignment)
    
    # Create initial version
    version = AssignmentVersion(
        assignment_id=assignment.id,
        version_number=1,
        change_summary="Initial AI Generation",
        structured_content=assignment.structured_content,
        full_text=assignment.full_text
    )
    db.add(version)
    db.commit()

    return assignment.to_dict(include_content=True)


@app.get("/api/assignments")
def get_user_assignments(
    search: Optional[str] = None,
    format_type: Optional[str] = None,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Assignment).filter(Assignment.user_id == user.id)
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            (Assignment.title.ilike(search_filter)) |
            (Assignment.topic.ilike(search_filter)) |
            (Assignment.subject.ilike(search_filter))
        )
    if format_type and format_type != "All":
        query = query.filter(Assignment.format_type == format_type)
        
    assignments = query.order_by(Assignment.updated_at.desc()).all()
    return [a.to_dict(include_content=False) for a in assignments]


@app.get("/api/assignments/{assignment_id}")
def get_assignment_detail(assignment_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id, Assignment.user_id == user.id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found or access denied.")
    return assignment.to_dict(include_content=True)


@app.put("/api/assignments/{assignment_id}")
def update_assignment_content(
    assignment_id: int,
    req: AssignmentUpdateRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id, Assignment.user_id == user.id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found or access denied.")
        
    if req.title:
        assignment.title = req.title
    if req.font_style:
        assignment.font_style = req.font_style
    if req.font_size:
        assignment.font_size = req.font_size
    if req.line_spacing:
        assignment.line_spacing = req.line_spacing
    if req.page_margins:
        assignment.page_margins = req.page_margins
    if req.citation_style:
        assignment.citation_style = req.citation_style
        
    if req.cover_page is not None:
        assignment.cover_page_json = json.dumps(req.cover_page)
        
    if req.references is not None:
        assignment.references_json = json.dumps(req.references)
        
    if req.sections is not None:
        assignment.structured_content = json.dumps(req.sections)
        # Rebuild full_text & recompute word count
        full_text_parts = [f"TITLE: {assignment.title}", "=" * 50]
        for s in req.sections:
            full_text_parts.append(f"## {s.get('title', '')}\n{s.get('content', '')}")
            if s.get("tables"):
                for t in s["tables"]:
                    full_text_parts.append(" | ".join(t.get("headers", [])))
                    for r in t.get("rows", []):
                        full_text_parts.append(" | ".join(r))
        assignment.full_text = "\n\n".join(full_text_parts)
        
        words = len(assignment.full_text.split())
        assignment.actual_words = words
        assignment.estimated_pages = max(1.0, round(words / 275.0, 1))

    assignment.updated_at = datetime.utcnow()
    
    # Save a version checkpoint
    v_count = db.query(AssignmentVersion).filter(AssignmentVersion.assignment_id == assignment.id).count()
    ver = AssignmentVersion(
        assignment_id=assignment.id,
        version_number=v_count + 1,
        change_summary=req.change_summary or "Document edited by user",
        structured_content=assignment.structured_content,
        full_text=assignment.full_text
    )
    db.add(ver)
    db.commit()
    db.refresh(assignment)
    
    return assignment.to_dict(include_content=True)


@app.post("/api/assignments/{assignment_id}/regenerate-section")
def regenerate_section(
    assignment_id: int,
    req: SectionRegenerateRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id, Assignment.user_id == user.id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
        
    result = regenerate_single_section(
        section_id=req.section_id,
        section_title=req.section_title,
        current_content=req.current_content,
        instruction=req.instruction,
        topic=assignment.topic,
        citation_style=assignment.citation_style
    )
    return result


@app.post("/api/assignments/{assignment_id}/duplicate")
def duplicate_assignment(assignment_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    original = db.query(Assignment).filter(Assignment.id == assignment_id, Assignment.user_id == user.id).first()
    if not original:
        raise HTTPException(status_code=404, detail="Assignment not found")
        
    copy_assignment = Assignment(
        user_id=user.id,
        title=f"{original.title} (Copy)",
        topic=original.topic,
        subject=original.subject,
        college_name=original.college_name,
        university_name=original.university_name,
        department=original.department,
        course=original.course,
        semester=original.semester,
        academic_year=original.academic_year,
        instructor_name=original.instructor_name,
        student_roll_no=original.student_roll_no,
        target_pages=original.target_pages,
        target_words=original.target_words,
        font_style=original.font_style,
        font_size=original.font_size,
        line_spacing=original.line_spacing,
        page_margins=original.page_margins,
        citation_style=original.citation_style,
        deadline=original.deadline,
        format_type=original.format_type,
        status="completed",
        structured_content=original.structured_content,
        full_text=original.full_text,
        cover_page_json=original.cover_page_json,
        references_json=original.references_json,
        actual_words=original.actual_words,
        estimated_pages=original.estimated_pages,
    )
    db.add(copy_assignment)
    db.commit()
    db.refresh(copy_assignment)
    return copy_assignment.to_dict(include_content=False)


@app.delete("/api/assignments/{assignment_id}")
def delete_assignment(assignment_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id, Assignment.user_id == user.id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    db.delete(assignment)
    db.commit()
    return {"message": "Assignment deleted successfully"}


# ==========================================
# EXPORT ENDPOINTS (PDF, DOCX, TXT)
# ==========================================
@app.get("/api/assignments/{assignment_id}/export/docx")
def download_docx(assignment_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id, Assignment.user_id == user.id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
        
    data = assignment.to_dict(include_content=True)
    file_path = export_to_docx(data)
    return FileResponse(
        path=str(file_path),
        filename=file_path.name,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    )


@app.get("/api/assignments/{assignment_id}/export/pdf")
def download_pdf(assignment_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id, Assignment.user_id == user.id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
        
    data = assignment.to_dict(include_content=True)
    file_path = export_to_pdf(data)
    return FileResponse(
        path=str(file_path),
        filename=file_path.name,
        media_type="application/pdf"
    )


@app.get("/api/assignments/{assignment_id}/export/txt")
def download_txt(assignment_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id, Assignment.user_id == user.id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
        
    data = assignment.to_dict(include_content=True)
    file_path = export_to_txt(data)
    return FileResponse(
        path=str(file_path),
        filename=file_path.name,
        media_type="text/plain; charset=utf-8"
    )


# ==========================================
# DASHBOARD STATS
# ==========================================
@app.get("/api/dashboard/stats")
def get_dashboard_stats(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    assignments = db.query(Assignment).filter(Assignment.user_id == user.id).all()
    total_assignments = len(assignments)
    total_words = sum(a.actual_words for a in assignments)
    avg_words = total_words // total_assignments if total_assignments > 0 else 0
    
    # Formats distribution
    format_counts = {}
    for a in assignments:
        format_counts[a.format_type] = format_counts.get(a.format_type, 0) + 1
        
    # Recent assignments
    recent = db.query(Assignment).filter(Assignment.user_id == user.id).order_by(Assignment.updated_at.desc()).limit(5).all()
    
    return {
        "total_assignments": total_assignments,
        "total_words": total_words,
        "avg_words": avg_words,
        "format_distribution": format_counts,
        "recent_assignments": [a.to_dict(include_content=False) for a in recent]
    }


# ==========================================
# ADMIN ENDPOINTS
# ==========================================
@app.get("/api/admin/stats")
def get_admin_metrics(admin: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    total_users = db.query(User).count()
    total_assignments = db.query(Assignment).count()
    total_words = db.query(func.sum(Assignment.actual_words)).scalar() or 0
    total_templates = db.query(AssignmentTemplate).count()
    
    return {
        "total_users": total_users,
        "total_assignments": total_assignments,
        "total_words_generated": int(total_words),
        "total_templates": total_templates
    }


@app.get("/api/admin/users")
def get_all_users(admin: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    users = db.query(User).all()
    results = []
    for u in users:
        u_dict = u.to_dict()
        u_dict["assignment_count"] = db.query(Assignment).filter(Assignment.user_id == u.id).count()
        results.append(u_dict)
    return results


@app.get("/api/admin/settings")
def get_platform_settings(admin: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    settings = db.query(PlatformSetting).all()
    return {s.key: s.value for s in settings}


@app.put("/api/admin/settings")
def update_platform_settings(req: PlatformSettingsUpdate, admin: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    for k, v in req.settings.items():
        item = db.query(PlatformSetting).filter(PlatformSetting.key == k).first()
        if item:
            item.value = str(v)
        else:
            db.add(PlatformSetting(key=k, value=str(v)))
    db.commit()
    return {"message": "Platform settings updated successfully"}


# Mount static files for frontend SPA
FRONTEND_DIR = BASE_DIR / "frontend"
if FRONTEND_DIR.exists():
    app.mount("/static", StaticFiles(directory=str(FRONTEND_DIR)), name="static")

    @app.get("/{full_path:path}")
    def serve_frontend_spa(full_path: str):
        # If specific file exists in frontend, serve it
        target_file = FRONTEND_DIR / full_path
        if full_path and target_file.is_file():
            return FileResponse(str(target_file))
        # Otherwise fallback to index.html for client-side routing
        return FileResponse(str(FRONTEND_DIR / "index.html"))
