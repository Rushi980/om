import os
from pathlib import Path
from typing import Dict, Any, List
from datetime import datetime

# Word Document Generation
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import qn, nsdecls

# PDF Generation
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

from backend.config import EXPORTS_DIR


class NumberedCanvas(canvas.Canvas):
    """ReportLab canvas that adds running header and 'Page X of Y' footer."""
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, total_pages):
        # Do not draw headers or footers on cover page (page 1)
        if self._pageNumber == 1:
            return
            
        self.saveState()
        self.setFont("Times-Roman", 9)
        self.setFillColor(colors.HexColor("#4B5563"))
        
        # Header line & text
        header_text = getattr(self, "header_title", "AssignmentPro Academic Document")
        self.drawString(54, 842 - 36, header_text[:70])
        self.setStrokeColor(colors.HexColor("#E5E7EB"))
        self.setLineWidth(0.5)
        self.line(54, 842 - 42, 595 - 54, 842 - 42)
        
        # Footer line & page numbering
        self.line(54, 48, 595 - 54, 48)
        page_str = f"Page {self._pageNumber} of {total_pages}"
        self.drawRightString(595 - 54, 34, page_str)
        self.drawString(54, 34, "AssignmentPro — Smart College Assignment Generator")
        self.restoreState()


def export_to_docx(assignment_data: Dict[str, Any]) -> Path:
    """Generate professional academic Word Document (.docx)."""
    doc = docx.Document()
    
    # 1. Page Margins (Normal 1 inch)
    for section in doc.sections:
        section.top_margin = Inches(1.0)
        section.bottom_margin = Inches(1.0)
        section.left_margin = Inches(1.0)
        section.right_margin = Inches(1.0)
        
    font_name = assignment_data.get("font_style", "Times New Roman")
    font_size_pt = int(assignment_data.get("font_size", 12))
    line_spacing_mult = float(assignment_data.get("line_spacing", 1.5))
    
    # Configure Normal Style
    style_normal = doc.styles['Normal']
    style_normal.font.name = font_name
    style_normal.font.size = Pt(font_size_pt)
    style_normal.font.color.rgb = RGBColor(30, 41, 59)
    style_normal.paragraph_format.line_spacing = line_spacing_mult
    style_normal.paragraph_format.space_after = Pt(8)

    cover = assignment_data.get("cover_page", {})
    
    # --- COVER PAGE ---
    # Institution Banner
    p_inst = doc.add_paragraph()
    p_inst.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_inst = p_inst.add_run(f"{cover.get('COLLEGE_NAME', cover.get('college_name', 'College of Technology')).upper()}\n")
    r_inst.bold = True
    r_inst.font.size = Pt(16)
    r_inst.font.color.rgb = RGBColor(30, 58, 138)  # Academic Navy Blue
    
    if cover.get("university_name"):
        r_uni = p_inst.add_run(f"{cover.get('university_name')}\n")
        r_uni.font.size = Pt(13)
        r_uni.font.color.rgb = RGBColor(71, 85, 105)
        
    if cover.get("department"):
        r_dept = p_inst.add_run(f"{cover.get('department')} | {cover.get('course', '')}\n")
        r_dept.font.size = Pt(11)
        r_dept.font.italic = True
        
    doc.add_paragraph("\n" * 2)
    
    # Title Box
    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_title = p_title.add_run(assignment_data.get("title", "Academic Assignment"))
    r_title.bold = True
    r_title.font.size = Pt(20)
    r_title.font.color.rgb = RGBColor(15, 23, 42)
    
    p_sub = doc.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_sub = p_sub.add_run(f"Subject: {assignment_data.get('subject', 'Academic Subject')} | Topic: {assignment_data.get('topic', '')}")
    r_sub.font.size = Pt(12)
    r_sub.font.color.rgb = RGBColor(100, 116, 139)
    
    doc.add_paragraph("\n" * 3)
    
    # Student / Faculty Box (Two column table)
    meta_table = doc.add_table(rows=5, cols=2)
    meta_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    meta_table.autofit = False
    
    col_widths = (Inches(3.0), Inches(3.0))
    for row in meta_table.rows:
        for i, w in enumerate(col_widths):
            row.cells[i].width = w

    meta_table.rows[0].cells[0].paragraphs[0].add_run("SUBMITTED BY:").bold = True
    meta_table.rows[0].cells[1].paragraphs[0].add_run("SUBMITTED TO:").bold = True
    
    meta_table.rows[1].cells[0].paragraphs[0].add_run(cover.get("student_name", "Student Scholar"))
    meta_table.rows[1].cells[1].paragraphs[0].add_run(cover.get("instructor_name", "Course Instructor"))
    
    meta_table.rows[2].cells[0].paragraphs[0].add_run(f"Roll/Reg No: {cover.get('student_roll_no', 'CS-2026-001')}")
    meta_table.rows[2].cells[1].paragraphs[0].add_run(f"Semester: {cover.get('semester', 'Semester VI')}")
    
    meta_table.rows[3].cells[0].paragraphs[0].add_run(f"Academic Year: {cover.get('academic_year', '2026-2027')}")
    meta_table.rows[3].cells[1].paragraphs[0].add_run(f"Citation Format: {assignment_data.get('citation_style', 'APA 7th')}")
    
    meta_table.rows[4].cells[0].paragraphs[0].add_run(f"Date of Submission: {cover.get('submission_date', datetime.now().strftime('%B %d, %Y'))}")
    meta_table.rows[4].cells[1].paragraphs[0].add_run(f"Assignment Format: {assignment_data.get('format_type', 'Standard')}")

    # Page Break after Cover Page
    doc.add_page_break()
    
    # --- TABLE OF CONTENTS ---
    p_toc_head = doc.add_paragraph()
    r_toc = p_toc_head.add_run("TABLE OF CONTENTS")
    r_toc.bold = True
    r_toc.font.size = Pt(14)
    r_toc.font.color.rgb = RGBColor(30, 58, 138)
    
    sections = assignment_data.get("sections", [])
    toc_table = doc.add_table(rows=len(sections) + 2, cols=2)
    toc_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    for r in toc_table.rows:
        r.cells[0].width = Inches(5.2)
        r.cells[1].width = Inches(1.0)
        
    toc_table.rows[0].cells[0].paragraphs[0].add_run("Section / Chapter Title").bold = True
    toc_table.rows[0].cells[1].paragraphs[0].add_run("Page").bold = True
    
    # Estimate page distribution
    running_page = 2
    for idx, sec in enumerate(sections):
        row = toc_table.rows[idx + 1]
        row.cells[0].paragraphs[0].add_run(sec.get("title", f"Section {idx+1}"))
        row.cells[1].paragraphs[0].add_run(str(running_page))
        # Advance page count every ~300 words
        w_in_sec = len(sec.get("content", "").split())
        running_page += max(1, w_in_sec // 320)
        
    toc_table.rows[-1].cells[0].paragraphs[0].add_run("References & Academic Bibliography").bold = True
    toc_table.rows[-1].cells[1].paragraphs[0].add_run(str(running_page))
    
    doc.add_page_break()
    
    # --- BODY SECTIONS ---
    for sec in sections:
        # Heading 1
        h1 = doc.add_paragraph()
        r_h1 = h1.add_run(sec.get("title", "Section"))
        r_h1.bold = True
        r_h1.font.size = Pt(font_size_pt + 3)
        r_h1.font.color.rgb = RGBColor(30, 58, 138)
        h1.paragraph_format.space_before = Pt(16)
        h1.paragraph_format.space_after = Pt(8)
        
        # Content paragraphs
        content_text = sec.get("content", "")
        paras = content_text.split("\n\n")
        for p_text in paras:
            if p_text.strip():
                p = doc.add_paragraph(p_text.strip())
                p.paragraph_format.first_line_indent = Inches(0.3)
                
        # Optional Tables inside section
        if sec.get("tables"):
            for tbl_data in sec["tables"]:
                doc.add_paragraph()
                p_cap = doc.add_paragraph()
                r_cap = p_cap.add_run(tbl_data.get("caption", "Table 1: Data Analysis"))
                r_cap.bold = True
                r_cap.font.italic = True
                r_cap.font.size = Pt(10)
                
                headers = tbl_data.get("headers", [])
                rows = tbl_data.get("rows", [])
                
                word_tbl = doc.add_table(rows=len(rows) + 1, cols=len(headers))
                word_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
                word_tbl.style = 'Table Grid'
                
                # Header row
                for col_idx, h_text in enumerate(headers):
                    cell = word_tbl.rows[0].cells[col_idx]
                    p_cell = cell.paragraphs[0]
                    p_cell.alignment = WD_ALIGN_PARAGRAPH.CENTER
                    r_c = p_cell.add_run(h_text)
                    r_c.bold = True
                    r_c.font.size = Pt(9.5)
                    r_c.font.color.rgb = RGBColor(255, 255, 255)
                    # Blue header background shading
                    shd = parse_xml(r'<w:shd {} w:fill="1E3A8A"/>'.format(nsdecls('w')))
                    cell._tc.get_or_add_tcPr().append(shd)
                    
                # Data rows
                for r_idx, r_vals in enumerate(rows):
                    row_cells = word_tbl.rows[r_idx + 1].cells
                    for col_idx, val in enumerate(r_vals):
                        p_val = row_cells[col_idx].paragraphs[0]
                        r_v = p_val.add_run(str(val))
                        r_v.font.size = Pt(9)
                        if r_idx % 2 == 1:
                            shd_alt = parse_xml(r'<w:shd {} w:fill="F8FAFC"/>'.format(nsdecls('w')))
                            row_cells[col_idx]._tc.get_or_add_tcPr().append(shd_alt)
                            
                doc.add_paragraph()

    # --- REFERENCES ---
    doc.add_page_break()
    h_ref = doc.add_paragraph()
    r_href = h_ref.add_run("References")
    r_href.bold = True
    r_href.font.size = Pt(font_size_pt + 3)
    r_href.font.color.rgb = RGBColor(30, 58, 138)
    h_ref.paragraph_format.space_before = Pt(16)
    h_ref.paragraph_format.space_after = Pt(8)
    
    references = assignment_data.get("references", [])
    for ref_item in references:
        ref_text = ref_item.get("citation", str(ref_item))
        p_ref = doc.add_paragraph()
        p_ref.paragraph_format.left_indent = Inches(0.5)
        p_ref.paragraph_format.first_line_indent = Inches(-0.5)  # Hanging indent
        p_ref.paragraph_format.space_after = Pt(6)
        p_ref.add_run(ref_text)
        
    # Save file
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    clean_title = "".join(c for c in assignment_data.get("title", "assignment") if c.isalnum() or c in (' ', '_', '-')).strip()
    clean_title = clean_title.replace(" ", "_")[:30]
    filename = f"AssignmentPro_{clean_title}_{timestamp}.docx"
    file_path = EXPORTS_DIR / filename
    doc.save(str(file_path))
    return file_path


def export_to_pdf(assignment_data: Dict[str, Any]) -> Path:
    """Generate publication-ready academic PDF with cover page and page numbers."""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    clean_title = "".join(c for c in assignment_data.get("title", "assignment") if c.isalnum() or c in (' ', '_', '-')).strip()
    clean_title = clean_title.replace(" ", "_")[:30]
    filename = f"AssignmentPro_{clean_title}_{timestamp}.pdf"
    file_path = EXPORTS_DIR / filename

    # A4 dimensions with 54pt (0.75 in) or 72pt (1 in) margins
    doc = SimpleDocTemplate(
        str(file_path),
        pagesize=A4,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'CoverTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=colors.HexColor('#0F172A'),
        alignment=1,  # Center
        spaceAfter=14
    )
    
    inst_style = ParagraphStyle(
        'CoverInst',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=15,
        leading=18,
        textColor=colors.HexColor('#1E3A8A'),
        alignment=1,
        spaceAfter=6
    )
    
    sub_inst_style = ParagraphStyle(
        'CoverSubInst',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=11,
        leading=14,
        textColor=colors.HexColor('#475569'),
        alignment=1,
        spaceAfter=18
    )
    
    h1_style = ParagraphStyle(
        'AcademicH1',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=colors.HexColor('#1E3A8A'),
        spaceBefore=14,
        spaceAfter=8,
        keepWithNext=True
    )
    
    body_style = ParagraphStyle(
        'AcademicBody',
        parent=styles['BodyText'],
        fontName='Times-Roman',
        fontSize=10.5,
        leading=15,
        textColor=colors.HexColor('#1E293B'),
        spaceAfter=8,
        firstLineIndent=18
    )
    
    ref_style = ParagraphStyle(
        'AcademicRef',
        parent=styles['Normal'],
        fontName='Times-Roman',
        fontSize=9.5,
        leading=13,
        textColor=colors.HexColor('#334155'),
        spaceAfter=6,
        leftIndent=24,
        firstLineIndent=-24
    )

    story = []
    cover = assignment_data.get("cover_page", {})
    
    # --- COVER PAGE ---
    story.append(Spacer(1, 20))
    story.append(Paragraph(cover.get("college_name", "INSTITUTE OF HIGHER EDUCATION").upper(), inst_style))
    if cover.get("university_name"):
        story.append(Paragraph(cover.get("university_name"), sub_inst_style))
    if cover.get("department"):
        story.append(Paragraph(f"{cover.get('department')} &bull; {cover.get('course', '')}", sub_inst_style))
        
    story.append(HRFlowable(width="80%", thickness=1.5, color=colors.HexColor('#1E3A8A'), spaceBefore=10, spaceAfter=25))
    story.append(Spacer(1, 25))
    
    story.append(Paragraph(assignment_data.get("title", "Academic Assignment"), title_style))
    story.append(Paragraph(f"<b>Subject:</b> {assignment_data.get('subject', '')} &nbsp;|&nbsp; <b>Topic:</b> {assignment_data.get('topic', '')}", sub_inst_style))
    
    story.append(Spacer(1, 40))
    
    # Metadata Grid
    meta_data = [
        [Paragraph("<b>SUBMITTED BY:</b>", styles['Normal']), Paragraph("<b>SUBMITTED TO:</b>", styles['Normal'])],
        [Paragraph(cover.get("student_name", "Student Scholar"), styles['Normal']), Paragraph(cover.get("instructor_name", "Course Instructor"), styles['Normal'])],
        [Paragraph(f"<b>Roll No:</b> {cover.get('student_roll_no', 'CS-2026-001')}", styles['Normal']), Paragraph(f"<b>Semester:</b> {cover.get('semester', 'Semester VI')}", styles['Normal'])],
        [Paragraph(f"<b>Academic Year:</b> {cover.get('academic_year', '2026-2027')}", styles['Normal']), Paragraph(f"<b>Format:</b> {assignment_data.get('format_type', 'Standard')}", styles['Normal'])],
        [Paragraph(f"<b>Submission Date:</b> {cover.get('submission_date', datetime.now().strftime('%B %d, %Y'))}", styles['Normal']), Paragraph(f"<b>Referencing:</b> {assignment_data.get('citation_style', 'APA 7th')}", styles['Normal'])],
    ]
    t_meta = Table(meta_data, colWidths=[240, 240])
    t_meta.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#CBD5E1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
        ('TOPPADDING', (0,0), (-1,-1), 7),
        ('BOTTOMPADDING', (0,0), (-1,-1), 7),
        ('LEFTPADDING', (0,0), (-1,-1), 12),
        ('RIGHTPADDING', (0,0), (-1,-1), 12),
    ]))
    story.append(t_meta)
    
    # Page Break after Cover Page
    story.append(PageBreak())
    
    # --- TABLE OF CONTENTS ---
    story.append(Paragraph("TABLE OF CONTENTS", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#E2E8F0'), spaceBefore=4, spaceAfter=12))
    
    sections = assignment_data.get("sections", [])
    toc_data = [["Section / Chapter Title", "Page"]]
    est_page = 2
    for idx, s in enumerate(sections):
        toc_data.append([s.get("title", f"Section {idx+1}"), str(est_page)])
        est_page += max(1, len(s.get("content", "").split()) // 320)
    toc_data.append(["References & Bibliography", str(est_page)])
    
    t_toc = Table(toc_data, colWidths=[420, 60])
    t_toc.setStyle(TableStyle([
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('LINEBELOW', (0,0), (-1,-1), 0.5, colors.HexColor('#F1F5F9')),
        ('ALIGN', (1,0), (1,-1), 'RIGHT'),
    ]))
    story.append(t_toc)
    story.append(PageBreak())
    
    # --- BODY SECTIONS ---
    for sec in sections:
        story.append(Paragraph(sec.get("title", "Section"), h1_style))
        content_text = sec.get("content", "")
        paras = content_text.split("\n\n")
        for p in paras:
            if p.strip():
                story.append(Paragraph(p.strip(), body_style))
                
        # Optional tables
        if sec.get("tables"):
            for tbl_data in sec["tables"]:
                story.append(Spacer(1, 6))
                cap_style = ParagraphStyle('Cap', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=8.5, textColor=colors.HexColor('#334155'))
                story.append(Paragraph(tbl_data.get("caption", "Table 1: Data Analysis"), cap_style))
                story.append(Spacer(1, 4))
                
                headers = [Paragraph(f"<b>{h}</b>", ParagraphStyle('H', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=8, textColor=colors.white)) for h in tbl_data.get("headers", [])]
                t_rows = [headers]
                for r in tbl_data.get("rows", []):
                    t_rows.append([Paragraph(str(val), ParagraphStyle('C', parent=styles['Normal'], fontSize=8, leading=10)) for val in r])
                    
                table_flowable = Table(t_rows, colWidths=[480 // len(tbl_data.get("headers", [1]))] * len(tbl_data.get("headers", [1])))
                table_flowable.setStyle(TableStyle([
                    ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#1E3A8A')),
                    ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
                    ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
                    ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor('#F8FAFC')]),
                    ('TOPPADDING', (0,0), (-1,-1), 4),
                    ('BOTTOMPADDING', (0,0), (-1,-1), 4),
                    ('LEFTPADDING', (0,0), (-1,-1), 6),
                    ('RIGHTPADDING', (0,0), (-1,-1), 6),
                ]))
                story.append(table_flowable)
                story.append(Spacer(1, 10))

    # --- REFERENCES ---
    story.append(PageBreak())
    story.append(Paragraph("References", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#E2E8F0'), spaceBefore=4, spaceAfter=12))
    
    for r in assignment_data.get("references", []):
        ref_text = r.get("citation", str(r))
        story.append(Paragraph(ref_text, ref_style))

    # Build PDF with custom NumberedCanvas
    doc.build(story, canvasmaker=NumberedCanvas)
    return file_path


def export_to_txt(assignment_data: Dict[str, Any]) -> Path:
    """Generate clean plain text (.txt) export."""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    clean_title = "".join(c for c in assignment_data.get("title", "assignment") if c.isalnum() or c in (' ', '_', '-')).strip()
    clean_title = clean_title.replace(" ", "_")[:30]
    filename = f"AssignmentPro_{clean_title}_{timestamp}.txt"
    file_path = EXPORTS_DIR / filename
    
    cover = assignment_data.get("cover_page", {})
    lines = [
        "=" * 70,
        f"{cover.get('college_name', 'COLLEGE NAME').upper()}",
        f"{cover.get('university_name', '')}",
        f"Department: {cover.get('department', '')} | Course: {cover.get('course', '')}",
        "=" * 70,
        "",
        f"TITLE: {assignment_data.get('title', '')}",
        f"TOPIC: {assignment_data.get('topic', '')}",
        f"SUBJECT: {assignment_data.get('subject', '')}",
        f"SUBMITTED BY: {cover.get('student_name', '')} (Roll No: {cover.get('student_roll_no', '')})",
        f"SUBMITTED TO: {cover.get('instructor_name', '')}",
        f"DATE: {cover.get('submission_date', '')}",
        f"CITATION STYLE: {assignment_data.get('citation_style', 'APA 7th')}",
        "",
        "-" * 70,
        "TABLE OF CONTENTS",
        "-" * 70
    ]
    for idx, s in enumerate(assignment_data.get("sections", [])):
        lines.append(f"{idx+1}. {s.get('title', '')}")
    lines.append(f"{len(assignment_data.get('sections', []))+1}. References")
    lines.append("")
    lines.append("=" * 70)
    lines.append("")
    
    for s in assignment_data.get("sections", []):
        lines.append(f"## {s.get('title', '')}")
        lines.append("")
        lines.append(s.get("content", ""))
        lines.append("")
        if s.get("tables"):
            for t in s["tables"]:
                lines.append(f"[Table: {t.get('caption', '')}]")
                lines.append(" | ".join(t.get("headers", [])))
                for r in t.get("rows", []):
                    lines.append(" | ".join(str(v) for v in r))
                lines.append("")
                
    lines.append("## References")
    lines.append("")
    for r in assignment_data.get("references", []):
        lines.append(f"- {r.get('citation', str(r))}")
        
    with open(file_path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))
        
    return file_path
