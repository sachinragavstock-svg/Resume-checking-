"""
Generate professional, high-design PowerPoint Presentation for ResumeIQ.
Uses python-pptx to create a modern 16:9 widescreen presentation.
"""

import sys
import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

def create_presentation(output_path="ResumeIQ_Presentation.pptx"):
    prs = Presentation()
    # 16:9 Widescreen standard
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)

    # Color Palette Constants (Modern Dark Theme)
    BG_COLOR = RGBColor(11, 17, 32)        # #0B1120 (Dark slate navy)
    CARD_BG = RGBColor(19, 28, 48)         # #131C30 (Card background)
    CARD_BORDER = RGBColor(38, 56, 92)     # #26385C (Border highlight)
    CYAN_ACCENT = RGBColor(6, 182, 212)    # #06B6D4 (Cyan primary)
    INDIGO_ACCENT = RGBColor(99, 102, 241) # #6366F1 (Indigo secondary)
    EMERALD_ACCENT = RGBColor(16, 185, 129)# #10B981 (Emerald success)
    AMBER_ACCENT = RGBColor(245, 158, 11)  # #F59E0B (Amber warning)
    ROSE_ACCENT = RGBColor(244, 63, 94)    # #F43F5E (Rose missing)
    TEXT_WHITE = RGBColor(248, 250, 252)   # #F8FAFC (Primary white)
    TEXT_MUTED = RGBColor(148, 163, 184)   # #94A3B8 (Muted gray)

    blank_layout = prs.slide_layouts[6]

    def set_slide_background(slide):
        bg_shape = slide.shapes.add_shape(
            MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(7.5)
        )
        bg_shape.fill.solid()
        bg_shape.fill.fore_color.rgb = BG_COLOR
        bg_shape.line.fill.background()
        return bg_shape

    def add_header(slide, title, category="RESUMEIQ TECHNICAL PRESENTATION"):
        # Category Tag
        cat_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.7), Inches(0.4))
        tf_cat = cat_box.text_frame
        tf_cat.word_wrap = True
        p_cat = tf_cat.paragraphs[0]
        p_cat.text = category.upper()
        p_cat.font.size = Pt(11)
        p_cat.font.bold = True
        p_cat.font.color.rgb = CYAN_ACCENT

        # Slide Title
        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.7), Inches(11.7), Inches(0.7))
        tf_title = title_box.text_frame
        tf_title.word_wrap = True
        p_title = tf_title.paragraphs[0]
        p_title.text = title
        p_title.font.size = Pt(24)
        p_title.font.bold = True
        p_title.font.color.rgb = TEXT_WHITE

    def add_card(slide, left, top, width, height, title, items, badge="", accent_color=CYAN_ACCENT):
        # Card background rectangle
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_BG
        card.line.color.rgb = CARD_BORDER
        card.line.width = Pt(1.5)

        # Content inside card
        tb = slide.shapes.add_textbox(left + Inches(0.2), top + Inches(0.2), width - Inches(0.4), height - Inches(0.4))
        tf = tb.text_frame
        tf.word_wrap = True

        # Card Title
        p0 = tf.paragraphs[0]
        p0.text = title
        p0.font.size = Pt(16)
        p0.font.bold = True
        p0.font.color.rgb = accent_color

        if badge:
            p_badge = tf.add_paragraph()
            p_badge.text = f"[{badge}]"
            p_badge.font.size = Pt(10)
            p_badge.font.bold = True
            p_badge.font.color.rgb = INDIGO_ACCENT

        # Card Bullet items
        for item in items:
            p = tf.add_paragraph()
            p.text = f"• {item}"
            p.font.size = Pt(12)
            p.font.color.rgb = TEXT_MUTED
            p.space_after = Pt(4)

    # -------------------------------------------------------------
    # SLIDE 1: Title Slide
    # -------------------------------------------------------------
    s1 = prs.slides.add_slide(blank_layout)
    set_slide_background(s1)

    # Accent decorative banner
    glow = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.8), Inches(11.733), Inches(4.2))
    glow.fill.solid()
    glow.fill.fore_color.rgb = CARD_BG
    glow.line.color.rgb = CYAN_ACCENT
    glow.line.width = Pt(2)

    tb1 = s1.shapes.add_textbox(Inches(1.2), Inches(2.1), Inches(11.0), Inches(3.5))
    tf1 = tb1.text_frame
    tf1.word_wrap = True

    p = tf1.paragraphs[0]
    p.text = "RESUMEIQ"
    p.font.size = Pt(44)
    p.font.bold = True
    p.font.color.rgb = CYAN_ACCENT

    p = tf1.add_paragraph()
    p.text = "DSA-Driven Resume Matching Engine & Interactive Algorithm Laboratory"
    p.font.size = Pt(20)
    p.font.bold = True
    p.font.color.rgb = TEXT_WHITE
    p.space_after = Pt(14)

    p = tf1.add_paragraph()
    p.text = "A deterministic, portfolio-grade system replacing black-box AI with verifiable Data Structures & Algorithms: HashMap O(1), Trie O(L), KMP O(N+M), Rabin-Karp O(N+M), Levenshtein DP O(NM), and Max-Heap Ranking O(K log K)."
    p.font.size = Pt(13)
    p.font.color.rgb = TEXT_MUTED
    p.space_after = Pt(20)

    p = tf1.add_paragraph()
    p.text = "Live Match Engine  |  Explainability Matrix  |  Battle View  |  DSA Lab  |  Empirical Benchmarks"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = INDIGO_ACCENT

    # -------------------------------------------------------------
    # SLIDE 2: Problem Statement & Motivation
    # -------------------------------------------------------------
    s2 = prs.slides.add_slide(blank_layout)
    set_slide_background(s2)
    add_header(s2, "The Problem with Modern Resume Screeners & The Solution")

    add_card(
        s2, Inches(0.8), Inches(1.7), Inches(5.6), Inches(5.1),
        "Current Industry Pitfalls (Black-Box AI)",
        [
            "Non-Deterministic Scores: Feeding the same resume multiple times yields fluctuating match percentages.",
            "Zero Explainability: Candidates & recruiters cannot see exactly why a score was awarded or which keywords triggered it.",
            "Hallucinations & False Assumptions: LLMs infer qualifications that aren't strictly documented.",
            "High API Latency & Cloud Cost: External LLM API calls are slow and expensive at scale.",
            "Opaque Decision Logic: Lack of audit trails for university placements, hackathons, and corporate ATS compliance."
        ],
        badge="THE CHALLENGE",
        accent_color=ROSE_ACCENT
    )

    add_card(
        s2, Inches(6.9), Inches(1.7), Inches(5.6), Inches(5.1),
        "The ResumeIQ Paradigm (Verifiable DSA)",
        [
            "100% Deterministic: Exact mathematical computation calculated from real algorithmic outputs.",
            "Transparent Proofs: Every requirement shows the exact matching method (HashMap, Trie, KMP, Edit Distance).",
            "Zero External AI Dependencies: Runs completely offline with native, handcrafted Python algorithms.",
            "Blazing Fast Execution: Sub-millisecond pipeline latency with O(1) hash maps and O(L) prefix lookups.",
            "Dual-Purpose Platform: Serves as both a production resume analyzer and an interactive algorithm laboratory."
        ],
        badge="OUR SOLUTION",
        accent_color=EMERALD_ACCENT
    )

    # -------------------------------------------------------------
    # SLIDE 3: System Architecture (7-Layer Flow)
    # -------------------------------------------------------------
    s3 = prs.slides.add_slide(blank_layout)
    set_slide_background(s3)
    add_header(s3, "End-to-End System Architecture (7-Layer Pipeline)")

    layers = [
        ("Layer 1: Document Parsing", "PDF, TXT, & Raw Stream Ingestion (pdfplumber)", CYAN_ACCENT),
        ("Layer 2: Tokenization & Normalization", "Stopword filtering, canonical alias mapping (React.js -> React)", INDIGO_ACCENT),
        ("Layer 3: In-Memory Dual Indexing", "HashMap O(1) keyword frequency + Trie O(L) prefix tree", CYAN_ACCENT),
        ("Layer 4: Advanced Substring Match", "KMP with LPS jump table & Rabin-Karp rolling hash", AMBER_ACCENT),
        ("Layer 5: Fuzzy & Typo Tolerance", "Dynamic Programming Levenshtein Edit Distance O(NM)", ROSE_ACCENT),
        ("Layer 6: Max-Heap Weight Ranking", "Importance attribution & priority heap sorting O(K log K)", EMERALD_ACCENT),
        ("Layer 7: Visual Audit & Battle View", "Mathematical score derivation, side-by-side matrix, report", TEXT_WHITE)
    ]

    top_y = 1.6
    for i, (l_title, l_desc, col) in enumerate(layers):
        c_shape = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(top_y + (i * 0.72)), Inches(11.733), Inches(0.62))
        c_shape.fill.solid()
        c_shape.fill.fore_color.rgb = CARD_BG
        c_shape.line.color.rgb = col
        c_shape.line.width = Pt(1.2)

        tb = s3.shapes.add_textbox(Inches(1.0), Inches(top_y + (i * 0.72) + 0.05), Inches(11.3), Inches(0.5))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = f"{l_title}: "
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = col

        # Description text
        run = p.add_run()
        run.text = l_desc
        run.font.size = Pt(12)
        run.font.bold = False
        run.font.color.rgb = TEXT_MUTED

    # -------------------------------------------------------------
    # SLIDE 4: Signature Feature — Live Match Engine
    # -------------------------------------------------------------
    s4 = prs.slides.add_slide(blank_layout)
    set_slide_background(s4)
    add_header(s4, "Signature Feature: Animated Live Match Engine")

    add_card(
        s4, Inches(0.8), Inches(1.7), Inches(3.6), Inches(5.1),
        "1. Visual Pipeline",
        [
            "Sequential animated progression across all 7 stages.",
            "Prevents instant abrupt scores; visually teaches algorithmic evaluation.",
            "Each stage highlights active data structures in real-time.",
            "Replay capability for presentations & demos."
        ],
        badge="ANIMATED STAGES",
        accent_color=CYAN_ACCENT
    )

    add_card(
        s4, Inches(4.8), Inches(1.7), Inches(3.6), Inches(5.1),
        "2. Stage Deep-Dive",
        [
            "Click any stage card to open the internal state inspector.",
            "Inspect raw tokens, character counts, and word distributions.",
            "View HashMap chaining buckets & collision counts.",
            "Trace character-by-character Trie traversal paths."
        ],
        badge="INTERNAL INSPECTOR",
        accent_color=INDIGO_ACCENT
    )

    add_card(
        s4, Inches(8.8), Inches(1.7), Inches(3.733), Inches(5.1),
        "3. Mathematical Proof",
        [
            "Live mathematical calculation strip showing exact points.",
            "Formula: (Matched Weight / Total Weight) * 100.",
            "Itemized points attribution for required vs preferred skills.",
            "Zero randomized numbers or arbitrary estimates."
        ],
        badge="VERIFIABLE FORMULA",
        accent_color=EMERALD_ACCENT
    )

    # -------------------------------------------------------------
    # SLIDE 5: Explainability & "How Was This Score Calculated?"
    # -------------------------------------------------------------
    s5 = prs.slides.add_slide(blank_layout)
    set_slide_background(s5)
    add_header(s5, "Explainable AI & Interactive Scoring Transparency")

    add_card(
        s5, Inches(0.8), Inches(1.7), Inches(5.6), Inches(5.1),
        "Algorithmic Attribution per Skill",
        [
            "Exact Match: Python -> Matched via Exact HashMap lookup (Freq: 4, O(1)).",
            "Normalized Match: React.js -> Normalized as React via taxonomy mapping.",
            "Substring Match: PostgreSQL -> Found in text via KMP LPS jump table (O(N+M)).",
            "Fuzzy Match: Pythan -> Matched with Python via Levenshtein DP (Dist: 1, 83% Sim).",
            "Missing Skill: AWS -> Verified missing across all 5 verification algorithms."
        ],
        badge="ITEMIZED PROOF",
        accent_color=CYAN_ACCENT
    )

    add_card(
        s5, Inches(6.9), Inches(1.7), Inches(5.6), Inches(5.1),
        "Live Interactive Weight Sliders",
        [
            "Scenario Simulation: Users can adjust weight sliders (1 - 20 pts) in real-time.",
            "Instant Recalculation: Visual formula updates immediately upon slider adjustment.",
            "Hiring Sensitivity Analysis: See how prioritizing Core Languages vs Cloud affects fit.",
            "One-Click Reset: Restore baseline job requirements with a single click."
        ],
        badge="WHAT-IF SCENARIOS",
        accent_color=AMBER_ACCENT
    )

    # -------------------------------------------------------------
    # SLIDE 6: Resume vs Job "Battle View"
    # -------------------------------------------------------------
    s6 = prs.slides.add_slide(blank_layout)
    set_slide_background(s6)
    add_header(s6, "Resume vs Job 'Battle View' (Combat Alignment)")

    add_card(
        s6, Inches(0.8), Inches(1.7), Inches(5.6), Inches(5.1),
        "Side-by-Side Combat Matrix",
        [
            "Direct comparison mapping candidate profile vs employer requirements.",
            "Clear Status Badges:",
            "  * 🟢 MATCHED: Candidate has verified skill (+Full Weight).",
            "  * 🟠 PARTIAL: Fuzzy/typo match (+50% Weight).",
            "  * 🔴 MISSING: Skill not found (0 pts).",
            "  * ⚪ NOT RELEVANT: Candidate extra bonus skills not requested."
        ],
        badge="ALIGNMENT MATRIX",
        accent_color=INDIGO_ACCENT
    )

    add_card(
        s6, Inches(6.9), Inches(1.7), Inches(5.6), Inches(5.1),
        "Multi-Dimensional Filtering & Insights",
        [
            "Instant Filter Tabs: ALL, MATCHED, MISSING, PARTIAL, REQUIRED.",
            "Identifies Skill Gaps: Clearly outlines exactly what skills the candidate needs to acquire.",
            "Bonus Strengths: Highlights candidate bonus capabilities (e.g. Machine Learning, C++) without penalizing score.",
            "Category Tagging: Groups skills by Languages, Frameworks, Cloud, Databases, and Tools."
        ],
        badge="GAP ANALYSIS",
        accent_color=EMERALD_ACCENT
    )

    # -------------------------------------------------------------
    # SLIDE 7: DSA Lab — HashMap & Trie
    # -------------------------------------------------------------
    s7 = prs.slides.add_slide(blank_layout)
    set_slide_background(s7)
    add_header(s7, "DSA Lab (Part 1): Custom HashMap & Prefix Trie")

    add_card(
        s7, Inches(0.8), Inches(1.7), Inches(5.6), Inches(5.1),
        "Custom HashMap with Separate Chaining",
        [
            "Hash Function: Polynomial rolling hash algorithm with prime multiplier 31.",
            "Collision Handling: Array of linked node buckets (Separate Chaining).",
            "Interactive Lifecycle: Visual animation of INPUT -> HASH -> BUCKET -> VALUE.",
            "Inspectable Buckets: Live grid showing all 16 bucket chains and key-value nodes.",
            "Time Complexity: O(1) Average Lookup & Insert | Space: O(N)."
        ],
        badge="HASHMAP LAB",
        accent_color=CYAN_ACCENT
    )

    add_card(
        s7, Inches(6.9), Inches(1.7), Inches(5.6), Inches(5.1),
        "Custom Trie (Prefix Tree)",
        [
            "Hierarchical Character Nodes: Multi-way tree storing keywords character-by-character.",
            "Animated Traversal: ROOT -> P -> Y -> T -> H -> O -> N with glowing pointer transitions.",
            "Autocomplete Engine: Instant prefix search & candidate suggestion generator.",
            "Dynamic Insertion: Add new words and watch tree structure update live.",
            "Time Complexity: O(L) Search where L = Word Length | Space: O(Sigma * L * N)."
        ],
        badge="TRIE LAB",
        accent_color=INDIGO_ACCENT
    )

    # -------------------------------------------------------------
    # SLIDE 8: DSA Lab — KMP & Rabin-Karp
    # -------------------------------------------------------------
    s8 = prs.slides.add_slide(blank_layout)
    set_slide_background(s8)
    add_header(s8, "DSA Lab (Part 2): KMP & Rabin-Karp String Matchers")

    add_card(
        s8, Inches(0.8), Inches(1.7), Inches(5.6), Inches(5.1),
        "Knuth-Morris-Pratt (KMP)",
        [
            "LPS Table: Precomputes Longest Proper Prefix which is also a Suffix.",
            "Zero Backtracking: Avoids re-evaluating previously matched characters on mismatch.",
            "Visual Character Stream: Animated comparison ribbon with i and j pointer indicators.",
            "LPS Jump Action: Highlights exact skip indices upon character mismatch.",
            "Time Complexity: O(N + M) Linear Search | Space: O(M) LPS Table."
        ],
        badge="KMP LAB",
        accent_color=AMBER_ACCENT
    )

    add_card(
        s8, Inches(6.9), Inches(1.7), Inches(5.6), Inches(5.1),
        "Rabin-Karp (Rolling Hash)",
        [
            "Sliding Window: Computes hash of pattern and matches against rolling text window.",
            "O(1) Rolling Update: (hash - old_char) * base + new_char (mod prime).",
            "Collision Detection: Direct character verification when hash matches to prevent false positives.",
            "Telemetry: Tracks active window index, rolling hash value, and collision counts.",
            "Time Complexity: O(N + M) Expected | Worst Case: O(N * M)."
        ],
        badge="RABIN-KARP LAB",
        accent_color=ROSE_ACCENT
    )

    # -------------------------------------------------------------
    # SLIDE 9: DSA Lab — Edit Distance & Ranking
    # -------------------------------------------------------------
    s9 = prs.slides.add_slide(blank_layout)
    set_slide_background(s9)
    add_header(s9, "DSA Lab (Part 3): DP Edit Distance & Max-Heap Ranking")

    add_card(
        s9, Inches(0.8), Inches(1.7), Inches(5.6), Inches(5.1),
        "Levenshtein Edit Distance (DP)",
        [
            "Matrix Recurrence: DP[i][j] = min(Insert, Delete, Replace) + cost.",
            "Cell-by-Cell Animation: Visualizes bottom-up dynamic programming calculation.",
            "Optimal Path Backtrace: Highlights the minimum transformation sequence from start to end.",
            "Similarity Percentage: Converts edit distance into normalized % match.",
            "Time Complexity: O(N * M) | Space Complexity: O(N * M) Grid."
        ],
        badge="EDIT DISTANCE LAB",
        accent_color=CYAN_ACCENT
    )

    add_card(
        s9, Inches(6.9), Inches(1.7), Inches(5.6), Inches(5.1),
        "Priority Max-Heap Ranking",
        [
            "Heap Ordering: Prioritizes requirements by importance weight using Max-Heap.",
            "Interactive Weight Sliders: Adjust requirement weights and observe dynamic score shifts.",
            "Proportional Influence: Core skills (e.g. 10 pts) contribute more than secondary skills (e.g. 5 pts).",
            "Category Breakdown: Analyzes coverage across Languages, Frameworks, and Tools.",
            "Time Complexity: O(K log K) Heap Sort | Space Complexity: O(K)."
        ],
        badge="RANKING LAB",
        accent_color=EMERALD_ACCENT
    )

    # -------------------------------------------------------------
    # SLIDE 10: Algorithm Performance Lab (Empirical Benchmarks)
    # -------------------------------------------------------------
    s10 = prs.slides.add_slide(blank_layout)
    set_slide_background(s10)
    add_header(s10, "Algorithm Performance Lab (Empirical Benchmarks)")

    add_card(
        s10, Inches(0.8), Inches(1.7), Inches(5.6), Inches(5.1),
        "Real CPU Execution Timing",
        [
            "Zero Hardcoded Numbers: Measured directly via Python's time.perf_counter().",
            "Variable Dataset Sizes: Scalable testing on 100, 1,000, 10,000, and 50,000 items.",
            "Comparative Search Suite: Linear Search O(N) vs HashMap O(1) vs Trie O(L).",
            "Comparative String Suite: Naive Search O(NM) vs KMP O(N+M) vs Rabin-Karp O(N+M).",
            "Empirical Speedups: HashMap and Trie consistently demonstrate up to 20x-100x speedups over Linear Search on large datasets."
        ],
        badge="EMPIRICAL METRICS",
        accent_color=CYAN_ACCENT
    )

    add_card(
        s10, Inches(6.9), Inches(1.7), Inches(5.6), Inches(5.1),
        "Hardware Transparency & Visual Telemetry",
        [
            "Interactive Progress Bars: Visual latency comparison in microseconds (us).",
            "Telemetry Tables: Itemized latency figures, operations estimates, and speedup ratios.",
            "Mandatory Hardware Disclaimer: 'Benchmark results depend on the user\\'s hardware, Python version, dataset, and implementation.'",
            "Demonstrates Real Theoretical Advantage: Concretely proves Big-O time complexity curves."
        ],
        badge="BENCHMARK LAB",
        accent_color=INDIGO_ACCENT
    )

    # -------------------------------------------------------------
    # SLIDE 11: Technology Stack & Implementation
    # -------------------------------------------------------------
    s11 = prs.slides.add_slide(blank_layout)
    set_slide_background(s11)
    add_header(s11, "Technology Stack & Technical Implementation")

    add_card(
        s11, Inches(0.8), Inches(1.7), Inches(3.6), Inches(5.1),
        "Backend Architecture",
        [
            "FastAPI: High-performance async REST API framework.",
            "Python 3.13: Pure native algorithms without heavy external dependencies.",
            "Pydantic: Strict schema validation for all endpoints.",
            "pdfplumber / pypdfium2: Deterministic document text extraction.",
            "time.perf_counter(): Microsecond CPU benchmarking."
        ],
        badge="FASTAPI & PYTHON",
        accent_color=CYAN_ACCENT
    )

    add_card(
        s11, Inches(4.8), Inches(1.7), Inches(3.6), Inches(5.1),
        "Frontend Interface",
        [
            "React 18 + Vite: Sub-second HMR and instant client state management.",
            "Tailwind CSS: Modern dark-mode glassmorphism styling.",
            "Lucide React: Clean, technical vector iconography.",
            "Canvas Confetti: Celebration feedback on strong matches.",
            "Fully Responsive: Optimized for desktops, tablets, and mobile."
        ],
        badge="REACT & VITE",
        accent_color=INDIGO_ACCENT
    )

    add_card(
        s11, Inches(8.8), Inches(1.7), Inches(3.733), Inches(5.1),
        "Engineering Best Practices",
        [
            "Clean Code Separation: Distinct algorithms, pipeline, and benchmark modules.",
            "RESTful API Design: Decoupled client-server architecture.",
            "Zero External AI Overhead: Fully functional offline & deterministic.",
            "Production-Grade Build: Vite bundle under 370 kB gzip-ready.",
            "Interactive Documentation: Swagger UI at /docs."
        ],
        badge="CODE QUALITY",
        accent_color=EMERALD_ACCENT
    )

    # -------------------------------------------------------------
    # SLIDE 12: Summary & Future Roadmap
    # -------------------------------------------------------------
    s12 = prs.slides.add_slide(blank_layout)
    set_slide_background(s12)
    add_header(s12, "Summary of Achievements & Future Roadmap")

    add_card(
        s12, Inches(0.8), Inches(1.7), Inches(5.6), Inches(5.1),
        "Key Deliverables Achieved",
        [
            "Portfolio-Grade Project: Fully working showcase for interviews, college presentations, and hackathons.",
            "Explainable & Auditable: Every match percentage is backed by mathematical and algorithmic proofs.",
            "Interactive Laboratory: 6 dedicated visual DSA sandboxes with step-by-step state animations.",
            "Empirical Benchmark Suite: Real CPU time comparison across 100 to 50,000 keys.",
            "Instant Demonstration Mode: 1-click realistic demo running the exact backend engine."
        ],
        badge="COMPLETED MILESTONES",
        accent_color=EMERALD_ACCENT
    )

    add_card(
        s12, Inches(6.9), Inches(1.7), Inches(5.6), Inches(5.1),
        "Future Enhancements & Scalability",
        [
            "Multi-Resume Batch Parser: Concurrent multi-threaded candidate ranking for large corporate batches.",
            "Graph-Based Skill Ontology: Knowledge graph representing skill hierarchies and cross-domain relationships.",
            "Exportable PDF Audit Dossiers: Single-click generation of verifiable candidate score reports.",
            "Optional AI Summarizer: Secondary LLM summary layer while keeping deterministic DSA core intact."
        ],
        badge="FUTURE ROADMAP",
        accent_color=CYAN_ACCENT
    )

    # -------------------------------------------------------------
    # SLIDE 13: Conclusion / Q&A Slide
    # -------------------------------------------------------------
    s13 = prs.slides.add_slide(blank_layout)
    set_slide_background(s13)

    glow13 = s13.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.8), Inches(11.733), Inches(4.2))
    glow13.fill.solid()
    glow13.fill.fore_color.rgb = CARD_BG
    glow13.line.color.rgb = EMERALD_ACCENT
    glow13.line.width = Pt(2)

    tb13 = s13.shapes.add_textbox(Inches(1.2), Inches(2.2), Inches(11.0), Inches(3.4))
    tf13 = tb13.text_frame
    tf13.word_wrap = True

    p = tf13.paragraphs[0]
    p.text = "Thank You!"
    p.font.size = Pt(40)
    p.font.bold = True
    p.font.color.rgb = CYAN_ACCENT

    p = tf13.add_paragraph()
    p.text = "ResumeIQ — The Future of Deterministic, Explainable Resume Matching"
    p.font.size = Pt(20)
    p.font.bold = True
    p.font.color.rgb = TEXT_WHITE
    p.space_after = Pt(14)

    p = tf13.add_paragraph()
    p.text = "• Web Application: http://localhost:5173\n• Backend API & Docs: http://127.0.0.1:8000/docs\n• Core Stack: FastAPI | Python 3.13 | React 18 | Vite | Tailwind CSS\n• Algorithms: HashMap | Trie | KMP | Rabin-Karp | DP Levenshtein | Max-Heap"
    p.font.size = Pt(13)
    p.font.color.rgb = TEXT_MUTED
    p.space_after = Pt(16)

    p = tf13.add_paragraph()
    p.text = "Questions & Demonstration Discussion"
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = EMERALD_ACCENT

    prs.save(output_path)
    print(f"Presentation successfully created at: {output_path}")

if __name__ == "__main__":
    create_presentation()
