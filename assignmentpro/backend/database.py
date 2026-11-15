import json
from datetime import datetime
from sqlalchemy import (
    create_engine, Column, Integer, String, Text, DateTime, ForeignKey, Boolean, Float
)
from sqlalchemy.orm import declarative_base, sessionmaker, relationship
from backend.config import DATABASE_URL

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), default="student")  # "student", "admin"
    
    # Academic profile
    college_name = Column(String(255), nullable=True)
    university_name = Column(String(255), nullable=True)
    department = Column(String(255), nullable=True)
    course = Column(String(255), nullable=True)
    student_id = Column(String(100), nullable=True)
    preferred_citation = Column(String(50), default="APA 7th")
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    assignments = relationship("Assignment", back_populates="owner", cascade="all, delete-orphan")
    college_profiles = relationship("CollegeProfile", back_populates="user", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "email": self.email,
            "full_name": self.full_name,
            "role": self.role,
            "college_name": self.college_name or "",
            "university_name": self.university_name or "",
            "department": self.department or "",
            "course": self.course or "",
            "student_id": self.student_id or "",
            "preferred_citation": self.preferred_citation or "APA 7th",
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


class CollegeProfile(Base):
    __tablename__ = "college_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    profile_name = Column(String(100), nullable=False)  # e.g., "MIT CS Spring 2026"
    college_name = Column(String(255), nullable=False)
    university_name = Column(String(255), nullable=True)
    department = Column(String(255), nullable=True)
    course = Column(String(255), nullable=True)
    
    # Default styling rules
    default_font = Column(String(50), default="Times New Roman")
    default_font_size = Column(Integer, default=12)
    default_line_spacing = Column(Float, default=1.5)
    default_margins = Column(String(50), default="Normal (1 inch)")
    default_citation = Column(String(50), default="APA 7th")
    is_default = Column(Boolean, default=False)
    
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="college_profiles")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "profile_name": self.profile_name,
            "college_name": self.college_name,
            "university_name": self.university_name or "",
            "department": self.department or "",
            "course": self.course or "",
            "default_font": self.default_font,
            "default_font_size": self.default_font_size,
            "default_line_spacing": self.default_line_spacing,
            "default_margins": self.default_margins,
            "default_citation": self.default_citation,
            "is_default": self.is_default,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


class AssignmentTemplate(Base):
    __tablename__ = "assignment_templates"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    category = Column(String(100), nullable=False)  # Standard, University-specific, Research-based, Technical, Practical, Case study, Project documentation
    description = Column(Text, nullable=True)
    structure_json = Column(Text, nullable=False)  # JSON array of section outlines
    citation_style = Column(String(50), default="APA 7th")
    is_system = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "category": self.category,
            "description": self.description or "",
            "structure": json.loads(self.structure_json) if self.structure_json else [],
            "citation_style": self.citation_style,
            "is_system": self.is_system,
        }


class Assignment(Base):
    __tablename__ = "assignments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Assignment core details
    title = Column(String(300), nullable=False)
    topic = Column(String(500), nullable=False)
    subject = Column(String(200), nullable=False)
    
    # College details
    college_name = Column(String(255), nullable=True)
    university_name = Column(String(255), nullable=True)
    department = Column(String(255), nullable=True)
    course = Column(String(255), nullable=True)
    semester = Column(String(100), nullable=True)
    academic_year = Column(String(100), nullable=True)
    instructor_name = Column(String(200), nullable=True)
    student_roll_no = Column(String(100), nullable=True)
    
    # Requirements
    target_pages = Column(Integer, default=5)
    target_words = Column(Integer, default=1500)
    font_style = Column(String(50), default="Times New Roman")
    font_size = Column(Integer, default=12)
    line_spacing = Column(Float, default=1.5)
    page_margins = Column(String(50), default="1 inch (2.54 cm)")
    citation_style = Column(String(50), default="APA 7th")
    deadline = Column(String(100), nullable=True)
    
    # Format and Template
    format_type = Column(String(100), default="Standard college assignment")
    template_id = Column(Integer, nullable=True)
    
    # Guidelines upload
    guidelines_filename = Column(String(255), nullable=True)
    guidelines_text = Column(Text, nullable=True)
    
    # Content & Status
    status = Column(String(50), default="completed")  # draft, generating, completed
    structured_content = Column(Text, nullable=False)  # JSON array of sections
    full_text = Column(Text, nullable=True)
    cover_page_json = Column(Text, nullable=True)
    references_json = Column(Text, nullable=True)
    
    # Metrics
    actual_words = Column(Integer, default=0)
    estimated_pages = Column(Float, default=1.0)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    owner = relationship("User", back_populates="assignments")
    versions = relationship("AssignmentVersion", back_populates="assignment", cascade="all, delete-orphan")

    def to_dict(self, include_content=True):
        data = {
            "id": self.id,
            "user_id": self.user_id,
            "title": self.title,
            "topic": self.topic,
            "subject": self.subject,
            "college_name": self.college_name or "",
            "university_name": self.university_name or "",
            "department": self.department or "",
            "course": self.course or "",
            "semester": self.semester or "",
            "academic_year": self.academic_year or "",
            "instructor_name": self.instructor_name or "",
            "student_roll_no": self.student_roll_no or "",
            "target_pages": self.target_pages,
            "target_words": self.target_words,
            "font_style": self.font_style,
            "font_size": self.font_size,
            "line_spacing": self.line_spacing,
            "page_margins": self.page_margins,
            "citation_style": self.citation_style,
            "deadline": self.deadline or "",
            "format_type": self.format_type,
            "template_id": self.template_id,
            "guidelines_filename": self.guidelines_filename or "",
            "guidelines_text": self.guidelines_text or "",
            "status": self.status,
            "actual_words": self.actual_words,
            "estimated_pages": self.estimated_pages,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
        if include_content:
            data["sections"] = json.loads(self.structured_content) if self.structured_content else []
            data["full_text"] = self.full_text or ""
            data["cover_page"] = json.loads(self.cover_page_json) if self.cover_page_json else {}
            data["references"] = json.loads(self.references_json) if self.references_json else []
        return data


class AssignmentVersion(Base):
    __tablename__ = "assignment_versions"

    id = Column(Integer, primary_key=True, index=True)
    assignment_id = Column(Integer, ForeignKey("assignments.id"), nullable=False)
    version_number = Column(Integer, default=1)
    change_summary = Column(String(255), default="Auto-saved draft")
    structured_content = Column(Text, nullable=False)
    full_text = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    assignment = relationship("Assignment", back_populates="versions")

    def to_dict(self):
        return {
            "id": self.id,
            "assignment_id": self.assignment_id,
            "version_number": self.version_number,
            "change_summary": self.change_summary,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


class PlatformSetting(Base):
    __tablename__ = "platform_settings"

    key = Column(String(100), primary_key=True)
    value = Column(Text, nullable=False)
    description = Column(String(255), nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


def init_db():
    Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
