"""
Resume & Job Document Parser supporting PDF, Text, and Markdown inputs.
"""

import io
from typing import Dict, Any


def extract_text_from_pdf(file_bytes: bytes) -> str:
    """Extracts text from PDF bytes using pdfplumber with fallback."""
    text_content = []
    try:
        import pdfplumber
        with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
            for page in pdf.pages:
                txt = page.extract_text()
                if txt:
                    text_content.append(txt)
    except Exception as e:
        # Fallback to pdfminer or pypdfium2 if pdfplumber fails
        try:
            import pypdfium2 as pdfium
            pdf = pdfium.PdfDocument(file_bytes)
            for page in pdf:
                text_page = page.get_textpage()
                text_content.append(text_page.get_text_range())
        except Exception:
            pass

    return "\n".join(text_content) if text_content else ""


def parse_document(raw_text: str = "", file_bytes: bytes = None, filename: str = "") -> Dict[str, Any]:
    """
    Parses document into raw text and calculates document statistics.
    """
    extracted_text = raw_text

    if file_bytes and filename:
        lower_name = filename.lower()
        if lower_name.endswith(".pdf"):
            extracted_text = extract_text_from_pdf(file_bytes)
        elif lower_name.endswith(".txt") or lower_name.endswith(".md"):
            try:
                extracted_text = file_bytes.decode("utf-8")
            except Exception:
                extracted_text = file_bytes.decode("latin-1", errors="ignore")

    lines = [line.strip() for line in extracted_text.splitlines() if line.strip()]
    words = extracted_text.split()
    chars = len(extracted_text)

    return {
        "raw_text": extracted_text,
        "line_count": len(lines),
        "word_count": len(words),
        "char_count": chars,
        "filename": filename if filename else "Direct Input Text"
    }
