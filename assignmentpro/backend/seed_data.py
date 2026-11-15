import json
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from backend.database import User, AssignmentTemplate, Assignment, CollegeProfile, PlatformSetting
from backend.auth import hash_password
from backend.ai_engine import FORMAT_BLUEPRINTS, _generate_with_academic_engine


def seed_all(db: Session):
    """Seed initial templates, platform settings, demo users, and sample assignments."""
    # 1. System Templates
    if db.query(AssignmentTemplate).count() == 0:
        templates = [
            {
                "name": "Standard College Term Paper",
                "category": "Standard college assignment",
                "description": "Ideal for general undergraduate & graduate assignments, term papers, and modular essays.",
                "structure_json": json.dumps(FORMAT_BLUEPRINTS["Standard college assignment"]),
                "citation_style": "APA 7th"
            },
            {
                "name": "University Syllabus & Curriculum Format",
                "category": "University-specific assignment",
                "description": "Tailored for departmental compliance, continuous assessment tests (CAT), and university syllabus criteria.",
                "structure_json": json.dumps(FORMAT_BLUEPRINTS["University-specific assignment"]),
                "citation_style": "APA 7th"
            },
            {
                "name": "Empirical Research & Journal Format",
                "category": "Research-based assignment",
                "description": "Structured with formal abstract, problem statement, methodology, empirical findings, and literature survey.",
                "structure_json": json.dumps(FORMAT_BLUEPRINTS["Research-based assignment"]),
                "citation_style": "IEEE"
            },
            {
                "name": "Engineering & Technical Architecture",
                "category": "Technical assignment",
                "description": "Detailed engineering breakdown covering system topology, algorithms, benchmarks, latency, and scalability.",
                "structure_json": json.dumps(FORMAT_BLUEPRINTS["Technical assignment"]),
                "citation_style": "IEEE"
            },
            {
                "name": "Laboratory & Practical Experiment",
                "category": "Practical assignment",
                "description": "Optimized for scientific laboratory journals, apparatus listings, observation tables, and error calculations.",
                "structure_json": json.dumps(FORMAT_BLUEPRINTS["Practical assignment"]),
                "citation_style": "APA 7th"
            },
            {
                "name": "Business Case Study & Strategic Analysis",
                "category": "Case study",
                "description": "Executive review with SWOT/PESTLE matrix, strategic dilemma breakdown, and financial/ROI implementation plans.",
                "structure_json": json.dumps(FORMAT_BLUEPRINTS["Case study"]),
                "citation_style": "Harvard"
            },
            {
                "name": "Software Project & System Documentation",
                "category": "Project documentation",
                "description": "Covers software requirements (SRS), system architecture, modular design, QA testing, and user guide.",
                "structure_json": json.dumps(FORMAT_BLUEPRINTS["Project documentation"]),
                "citation_style": "IEEE"
            },
        ]
        for t in templates:
            db.add(AssignmentTemplate(**t))
        db.commit()

    # 2. Platform Settings
    default_settings = [
        ("ai_provider", "Built-in High-Rigor Academic Engine", "Default AI engine provider"),
        ("gemini_model", "gemini-2.5-flash", "Gemini model version"),
        ("max_word_limit", "15000", "Maximum words permitted per assignment"),
        ("allow_public_registration", "true", "Enable student self-registration"),
        ("require_email_verification", "false", "Require email confirmation"),
        ("system_announcement", "Welcome to AssignmentPro 2026. Fully compatible with APA 7th, IEEE, MLA 9th, Harvard, and Chicago citation rules.", "Global dashboard banner"),
    ]
    for k, v, d in default_settings:
        if not db.query(PlatformSetting).filter(PlatformSetting.key == k).first():
            db.add(PlatformSetting(key=k, value=v, description=d))
    db.commit()

    # 3. Demo Admin User
    admin = db.query(User).filter(User.email == "admin@assignmentpro.edu").first()
    if not admin:
        admin = User(
            email="admin@assignmentpro.edu",
            hashed_password=hash_password("AdminPassword2026!"),
            full_name="Prof. Eleanor Vance",
            role="admin",
            college_name="Apex Institute of Technology",
            university_name="Metropolitan State University",
            department="Dean of Academic Affairs",
            course="Administration",
            student_id="FAC-8819",
            preferred_citation="APA 7th"
        )
        db.add(admin)
        db.commit()
        db.refresh(admin)

    # 4. Demo Student User
    student = db.query(User).filter(User.email == "student@assignmentpro.edu").first()
    if not student:
        student = User(
            email="student@assignmentpro.edu",
            hashed_password=hash_password("StudentPassword2026!"),
            full_name="Alex Chen",
            role="student",
            college_name="Stanford School of Engineering",
            university_name="Stanford University",
            department="Computer Science & Engineering",
            course="B.S. in Computer Science",
            student_id="STAN-CS-2026-442",
            preferred_citation="IEEE"
        )
        db.add(student)
        db.commit()
        db.refresh(student)

        # Saved College Profile for student
        profile = CollegeProfile(
            user_id=student.id,
            profile_name="Stanford CS Dept Format",
            college_name="Stanford School of Engineering",
            university_name="Stanford University",
            department="Computer Science & Engineering",
            course="B.S. in Computer Science",
            default_font="Times New Roman",
            default_font_size=12,
            default_line_spacing=1.5,
            default_margins="Normal (1 inch)",
            default_citation="IEEE",
            is_default=True
        )
        db.add(profile)
        db.commit()

        # Generate 3 initial realistic sample assignments for student
        samples = [
            {
                "topic": "Distributed Consensus Protocols in Cloud Infrastructures: Raft vs. Paxos",
                "title": "A Comparative Architectural Evaluation of Distributed Consensus: Raft vs. Multi-Paxos under Network Partitions",
                "subject": "Distributed Systems",
                "format_type": "Technical assignment",
                "target_words": 1800,
                "target_pages": 6,
                "citation_style": "IEEE",
                "instructor_name": "Prof. David Mazieres",
                "deadline": "November 28, 2026",
            },
            {
                "topic": "Platform Economics and Network Effects in Electric Vehicle Charging Infrastructure",
                "title": "The Strategic Dynamics of Two-Sided Platform Ecosystems: A Case Study of Electric Mobility",
                "subject": "Strategic Management",
                "format_type": "Case study",
                "target_words": 1500,
                "target_pages": 5,
                "citation_style": "Harvard",
                "instructor_name": "Dr. Sarah Jenkins",
                "deadline": "December 04, 2026",
            },
            {
                "topic": "Microcontroller Telemetry and Sensor Fusion in Precision Agriculture",
                "title": "Experimental Calibration and Accuracy Inferences of Soil Moisture Sensor Telemetry",
                "subject": "Embedded Systems Lab",
                "format_type": "Practical assignment",
                "target_words": 1200,
                "target_pages": 4,
                "citation_style": "APA 7th",
                "instructor_name": "Dr. Anand Rao",
                "deadline": "December 12, 2026",
            }
        ]

        for s_idx, samp in enumerate(samples):
            gen = _generate_with_academic_engine(
                topic=samp["topic"],
                title=samp["title"],
                subject=samp["subject"],
                format_type=samp["format_type"],
                target_words=samp["target_words"],
                target_pages=samp["target_pages"],
                college_name=student.college_name,
                university_name=student.university_name,
                department=student.department,
                course=student.course,
                instructor_name=samp["instructor_name"],
                student_roll_no=student.student_id,
                semester="Semester VI",
                academic_year="2026-2027",
                citation_style=samp["citation_style"]
            )
            
            created_dt = datetime.utcnow() - timedelta(days=2 * (s_idx + 1))
            assignment = Assignment(
                user_id=student.id,
                title=gen["title"],
                topic=gen["topic"],
                subject=gen["subject"],
                college_name=student.college_name,
                university_name=student.university_name,
                department=student.department,
                course=student.course,
                semester="Semester VI",
                academic_year="2026-2027",
                instructor_name=samp["instructor_name"],
                student_roll_no=student.student_id,
                target_pages=samp["target_pages"],
                target_words=samp["target_words"],
                font_style="Times New Roman",
                font_size=12,
                line_spacing=1.5,
                page_margins="1 inch (2.54 cm)",
                citation_style=samp["citation_style"],
                deadline=samp["deadline"],
                format_type=samp["format_type"],
                status="completed",
                structured_content=json.dumps(gen["sections"]),
                full_text=gen["full_text"],
                cover_page_json=json.dumps(gen["cover_page"]),
                references_json=json.dumps(gen["references"]),
                actual_words=gen["actual_words"],
                estimated_pages=gen["estimated_pages"],
                created_at=created_dt,
                updated_at=created_dt
            )
            db.add(assignment)
        db.commit()
