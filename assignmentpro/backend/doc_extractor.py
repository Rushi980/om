import re
from pathlib import Path
from typing import Dict, Any
import pypdf
import docx

def extract_text_from_file(file_path: Path) -> str:
    """Extract raw text from PDF, DOCX, or TXT file."""
    ext = file_path.suffix.lower()
    text = ""
    
    if ext == ".pdf":
        try:
            reader = pypdf.PdfReader(str(file_path))
            pages_text = []
            for i, page in enumerate(reader.pages):
                extracted = page.extract_text()
                if extracted:
                    pages_text.append(f"--- [Page {i+1}] ---\n{extracted.strip()}")
            text = "\n\n".join(pages_text)
        except Exception as e:
            text = f"Error reading PDF file: {str(e)}"

    elif ext == ".docx":
        try:
            doc = docx.Document(str(file_path))
            paras = [p.text for p in doc.paragraphs if p.text.strip()]
            
            # Also extract tables if present
            table_texts = []
            for t_idx, table in enumerate(doc.tables):
                rows_data = []
                for row in table.rows:
                    row_cells = [cell.text.strip() for cell in row.cells]
                    rows_data.append(" | ".join(row_cells))
                if rows_data:
                    table_texts.append(f"[Table {t_idx+1}]\n" + "\n".join(rows_data))
            
            all_content = paras + table_texts
            text = "\n\n".join(all_content)
        except Exception as e:
            text = f"Error reading DOCX file: {str(e)}"

    elif ext in [".txt", ".md", ".csv", ".json"]:
        try:
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                text = f.read()
        except Exception as e:
            text = f"Error reading text file: {str(e)}"

    else:
        text = f"Document uploaded ({file_path.name}). Format acknowledged."

    return text.strip()


def parse_assignment_guidelines(text: str) -> Dict[str, Any]:
    """
    Intelligently inspect extracted guideline text to discover required parameters
    such as word count, pages, citation style, font rules, and section headings.
    """
    insights = {
        "detected_word_count": None,
        "detected_pages": None,
        "detected_citation": None,
        "detected_font": None,
        "detected_spacing": None,
        "mandatory_sections": [],
        "submission_rules": [],
        "summary": ""
    }
    
    lower_text = text.lower()
    
    # Detect word count
    wc_match = re.search(r'(\d{3,5})\s*(?:-\s*(\d{3,5}))?\s*words?', lower_text)
    if wc_match:
        if wc_match.group(2):
            insights["detected_word_count"] = int(wc_match.group(2))
        else:
            insights["detected_word_count"] = int(wc_match.group(1))
            
    # Detect page count
    pg_match = re.search(r'(\d{1,2})\s*(?:-\s*(\d{1,2}))?\s*pages?', lower_text)
    if pg_match:
        if pg_match.group(2):
            insights["detected_pages"] = int(pg_match.group(2))
        else:
            insights["detected_pages"] = int(pg_match.group(1))

    # Detect citation style
    if "apa" in lower_text:
        insights["detected_citation"] = "APA 7th"
    elif "ieee" in lower_text:
        insights["detected_citation"] = "IEEE"
    elif "mla" in lower_text:
        insights["detected_citation"] = "MLA 9th"
    elif "harvard" in lower_text:
        insights["detected_citation"] = "Harvard"
    elif "chicago" in lower_text:
        insights["detected_citation"] = "Chicago"

    # Detect font
    if "times new roman" in lower_text:
        insights["detected_font"] = "Times New Roman"
    elif "calibri" in lower_text:
        insights["detected_font"] = "Calibri"
    elif "arial" in lower_text:
        insights["detected_font"] = "Arial"

    # Detect line spacing
    if "double space" in lower_text or "2.0 spacing" in lower_text:
        insights["detected_spacing"] = 2.0
    elif "1.5 space" in lower_text or "1.5 line" in lower_text:
        insights["detected_spacing"] = 1.5

    # Look for common academic headings
    common_headings = [
        "Abstract", "Executive Summary", "Introduction", "Literature Review",
        "Problem Statement", "Objectives", "Theoretical Framework", "Methodology",
        "System Architecture", "Implementation", "Experimental Setup",
        "Results and Discussion", "Case Analysis", "Practical Observations",
        "Evaluation", "Recommendations", "Conclusion", "References", "Bibliography", "Appendices"
    ]
    for h in common_headings:
        if re.search(rf'\b{re.escape(h.lower())}\b', lower_text):
            insights["mandatory_sections"].append(h)

    # Generate a readable summary
    summary_parts = []
    if insights["detected_word_count"]:
        summary_parts.append(f"Target word count: ~{insights['detected_word_count']} words")
    if insights["detected_pages"]:
        summary_parts.append(f"Target pages: ~{insights['detected_pages']} pages")
    if insights["detected_citation"]:
        summary_parts.append(f"Referencing style: {insights['detected_citation']}")
    if insights["detected_font"]:
        summary_parts.append(f"Font guideline: {insights['detected_font']}")
    if insights["mandatory_sections"]:
        summary_parts.append(f"Identified sections: {', '.join(insights['mandatory_sections'][:6])}")
        
    insights["summary"] = "; ".join(summary_parts) if summary_parts else "Guideline parsed successfully. All instructions incorporated."
    return insights
