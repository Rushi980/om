from typing import List, Optional, Dict, Any
from pydantic import BaseModel, EmailStr, Field


class UserRegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    full_name: str = Field(..., min_length=2)
    role: Optional[str] = "student"
    college_name: Optional[str] = ""
    university_name: Optional[str] = ""
    department: Optional[str] = ""
    course: Optional[str] = ""
    student_id: Optional[str] = ""
    preferred_citation: Optional[str] = "APA 7th"


class UserLoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserUpdateRequest(BaseModel):
    full_name: Optional[str] = None
    college_name: Optional[str] = None
    university_name: Optional[str] = None
    department: Optional[str] = None
    course: Optional[str] = None
    student_id: Optional[str] = None
    preferred_citation: Optional[str] = None


class CollegeProfileCreate(BaseModel):
    profile_name: str
    college_name: str
    university_name: Optional[str] = ""
    department: Optional[str] = ""
    course: Optional[str] = ""
    default_font: Optional[str] = "Times New Roman"
    default_font_size: Optional[int] = 12
    default_line_spacing: Optional[float] = 1.5
    default_margins: Optional[str] = "Normal (1 inch)"
    default_citation: Optional[str] = "APA 7th"
    is_default: Optional[bool] = False


class AssignmentSectionSchema(BaseModel):
    id: str
    title: str
    level: int = 1
    content: str
    order: int
    tables: Optional[List[Dict[str, Any]]] = []
    notes: Optional[str] = ""


class AssignmentCreateRequest(BaseModel):
    college_name: Optional[str] = "Springfield Institute of Technology"
    university_name: Optional[str] = "State Technical University"
    department: Optional[str] = "Computer Science & Engineering"
    course: Optional[str] = "Bachelor of Technology"
    semester: Optional[str] = "Semester VI"
    academic_year: Optional[str] = "2026-2027"
    instructor_name: Optional[str] = "Dr. Robert Vance, Professor"
    student_roll_no: Optional[str] = "CS-2026-8942"
    
    subject: str = Field(..., min_length=2)
    topic: str = Field(..., min_length=3)
    title: str = Field(..., min_length=3)
    
    target_pages: int = Field(default=5, ge=1, le=100)
    target_words: int = Field(default=1500, ge=300, le=25000)
    
    font_style: str = "Times New Roman"
    font_size: int = 12
    line_spacing: float = 1.5
    page_margins: str = "1 inch (2.54 cm)"
    citation_style: str = "APA 7th"
    deadline: Optional[str] = ""
    
    format_type: str = "Standard college assignment"
    template_id: Optional[int] = None
    guidelines_text: Optional[str] = ""


class AssignmentUpdateRequest(BaseModel):
    title: Optional[str] = None
    sections: Optional[List[Dict[str, Any]]] = None
    cover_page: Optional[Dict[str, Any]] = None
    references: Optional[List[Dict[str, Any]]] = None
    font_style: Optional[str] = None
    font_size: Optional[int] = None
    line_spacing: Optional[float] = None
    page_margins: Optional[str] = None
    citation_style: Optional[str] = None
    change_summary: Optional[str] = "Manual user update"


class SectionRegenerateRequest(BaseModel):
    section_id: str
    section_title: str
    current_content: str
    instruction: str  # expand, shorten, formal, fix_grammar, add_table, or custom instruction
    assignment_topic: Optional[str] = ""
    citation_style: Optional[str] = "APA 7th"


class GuidelinesParseRequest(BaseModel):
    raw_text: str


class PlatformSettingsUpdate(BaseModel):
    settings: Dict[str, str]
