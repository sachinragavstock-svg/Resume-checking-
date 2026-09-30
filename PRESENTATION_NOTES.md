# ResumeIQ — Technical Presentation Slide Deck & Speaker Notes

**Presentation File:** [`ResumeIQ_Presentation.pptx`](file:///c:/Users/sachin%20ragav/OneDrive/Desktop/PT1%20project/ResumeIQ_Presentation.pptx)  
**Layout:** 16:9 Widescreen | **Theme:** Modern Dark Slate (`#0B1120`) with Cyan (`#06B6D4`) and Indigo (`#6366F1`) Accents.

---

## Slide 1: Title Slide
* **Title:** **RESUMEIQ**
* **Subtitle:** DSA-Driven Resume Matching Engine & Interactive Algorithm Laboratory
* **Summary:** A deterministic, portfolio-grade system replacing black-box AI with verifiable Data Structures & Algorithms: HashMap $O(1)$, Trie $O(L)$, KMP $O(N+M)$, Rabin-Karp $O(N+M)$, Levenshtein DP $O(NM)$, and Max-Heap Ranking $O(K \log K)$.
* **Key Badges:** Live Match Engine | Explainability Matrix | Battle View | DSA Lab | Empirical Benchmarks
* **Speaker Notes:**
  > *"Good morning/afternoon everyone. Today, I am excited to present ResumeIQ — a deterministic, high-performance resume matching engine and algorithm laboratory. Unlike traditional opaque AI screeners, ResumeIQ proves every score using transparent Data Structures & Algorithms."*

---

## Slide 2: Problem Statement & Motivation
* **Left Card (The Challenge — Black-Box AI):**
  * Non-Deterministic Scores: Same resume produces fluctuating scores on different runs.
  * Zero Explainability: Candidates and recruiters cannot see how a percentage was calculated.
  * Hallucinations & False Assumptions: LLMs infer qualifications that aren't strictly documented.
  * High Latency & Cost: External LLM API calls are slow and expensive at scale.
* **Right Card (Our Solution — Verifiable DSA):**
  * 100% Deterministic: Exact mathematical calculation from real algorithm outputs.
  * Transparent Proofs: Every requirement shows the exact matching method.
  * Zero External AI Dependencies: Runs completely offline with native handcrafted Python algorithms.
  * Blazing Fast Execution: Sub-millisecond pipeline latency.
* **Speaker Notes:**
  > *"Most automated resume screeners today rely on black-box LLMs that hallucinate, cost money per API call, and can't explain their scoring. ResumeIQ solves this by returning to the mathematical foundations of computer science — deterministic matching with verifiable Big-O complexity."*

---

## Slide 3: End-to-End System Architecture (7 Layers)
* **Layer 1:** Document Parsing (PDF, TXT, MD, Raw Stream Ingestion via `pdfplumber`).
* **Layer 2:** Tokenization & Normalization (Stopwords filter, canonical taxonomy mapping: `React.js` $\rightarrow$ `React`).
* **Layer 3:** In-Memory Dual Indexing (HashMap $O(1)$ keyword frequency + Trie $O(L)$ prefix tree).
* **Layer 4:** Advanced Substring Matching (KMP with LPS jump table & Rabin-Karp rolling hash).
* **Layer 5:** Fuzzy & Typo Tolerance (Dynamic Programming Levenshtein Edit Distance $O(NM)$).
* **Layer 6:** Max-Heap Weight Ranking (Importance attribution & priority heap sorting $O(K \log K)$).
* **Layer 7:** Visual Audit & Battle View (Mathematical derivation, side-by-side combat matrix, report).
* **Speaker Notes:**
  > *"Here is the 7-layer architecture of ResumeIQ. When a resume and job description enter the system, they are tokenized, normalized, indexed into HashMaps and Tries, verified via KMP and Rabin-Karp, checked for typo tolerance via Levenshtein DP, and ranked using a Max-Heap."*

---

## Slide 4: Signature Feature — Animated Live Match Engine
* **Card 1 (Visual Pipeline):** Sequential animated progression across all 7 stages. Teaches algorithmic evaluation visually.
* **Card 2 (Stage Deep-Dive):** Click any stage card to inspect internal states (character metrics, HashMap chaining buckets, Trie node paths).
* **Card 3 (Mathematical Proof):** Live formula display: $\frac{\text{Matched Weight}}{\text{Total Weight}} \times 100 = \text{Score}\%$.
* **Speaker Notes:**
  > *"One of our core features is the Live Match Engine. Instead of immediately dumping a score, ResumeIQ animates through all 7 pipeline stages. The user can click any stage card to inspect the exact memory state and hash buckets."*

---

## Slide 5: Explainable AI & "How Was This Score Calculated?"
* **Itemized Proofs:**
  * Exact Match: Python matched via Exact HashMap lookup ($O(1)$).
  * Normalized Match: React.js normalized to React via alias taxonomy.
  * Substring Match: PostgreSQL found via KMP LPS jump table ($O(N+M)$).
  * Fuzzy Match: Pythan matched with Python via Levenshtein DP ($83\%$ similarity).
  * Missing: AWS verified missing across all 5 verification algorithms.
* **Interactive Weight Sliders:** Adjust requirement importance from 1–20 pts with real-time recalculation.
* **Speaker Notes:**
  > *"The 'How Was This Score Calculated?' modal eliminates all ambiguity. Every requirement is explicitly categorized with its algorithm method and points contribution. Users can tweak requirement sliders to run what-if hiring scenarios."*

---

## Slide 6: Resume vs Job "Battle View"
* **Side-by-Side Combat Matrix:**
  * 🟢 **MATCHED:** Candidate has verified skill (+Full Weight).
  * 🟠 **PARTIAL:** Fuzzy / typo match (+50% Weight).
  * 🔴 **MISSING:** Skill not found (0 pts).
  * ⚪ **NOT RELEVANT:** Candidate extra bonus skills not requested by the role.
* **Gap Analysis Filters:** Quick toggle filters (`ALL`, `MATCHED`, `MISSING`, `PARTIAL`, `REQUIRED`).
* **Speaker Notes:**
  > *"The Battle View pits the candidate's profile against the employer's requirements side-by-side, making missing competencies and bonus capabilities instantly apparent."*

---

## Slide 7: DSA Lab (Part 1) — HashMap & Prefix Trie
* **Custom HashMap:**
  * Polynomial rolling hash algorithm with prime multiplier 31.
  * Separate Chaining with linked list bucket arrays.
  * Animated lookup: `INPUT` $\rightarrow$ `HASH` $\rightarrow$ `BUCKET` $\rightarrow$ `VALUE`.
  * Time: $O(1)$ Average Lookup | Space: $O(N)$.
* **Custom Trie (Prefix Tree):**
  * Hierarchical character tree storing keywords character-by-character.
  * Animated traversal: `ROOT` $\rightarrow$ `P` $\rightarrow$ `Y` $\rightarrow$ `T` $\rightarrow$ `H` $\rightarrow$ `O` $\rightarrow$ `N` ✓.
  * Prefix Autocomplete suggestion generator.
  * Time: $O(L)$ Search Complexity | Space: $O(\Sigma \cdot L \cdot N)$.
* **Speaker Notes:**
  > *"In our Interactive DSA Lab, users can test and inspect our custom HashMap and Trie data structures. We visualize bucket chains, collision handling, and character-by-character prefix traversal in real-time."*

---

## Slide 8: DSA Lab (Part 2) — KMP & Rabin-Karp
* **Knuth-Morris-Pratt (KMP):**
  * Longest Proper Prefix which is also a Suffix (LPS Table).
  * Zero backtracking in target text on character mismatch.
  * Time: $O(N + M)$ Linear Search | Space: $O(M)$ LPS Table.
* **Rabin-Karp (Rolling Hash):**
  * Sliding window with $O(1)$ rolling polynomial hash updates.
  * Direct character verification on hash match to prevent collision false positives.
  * Time: $O(N + M)$ Expected | Worst Case: $O(N \cdot M)$.
* **Speaker Notes:**
  > *"For direct text matching, we implement KMP and Rabin-Karp. KMP builds an LPS table to skip comparisons without backtracking, while Rabin-Karp slides a rolling hash window with collision verification."*

---

## Slide 9: DSA Lab (Part 3) — DP Edit Distance & Max-Heap Ranking
* **Levenshtein Edit Distance (DP):**
  * Matrix Recurrence: $DP[i][j] = \min(\text{Insert}, \text{Delete}, \text{Replace}) + \text{cost}$.
  * Cell-by-cell calculation animation and optimal backtrace path.
  * Time: $O(N \times M)$ | Space: $O(N \times M)$ grid.
* **Priority Max-Heap Ranking:**
  * Orders requirements by priority weight using a Max-Heap ($O(K \log K)$).
  * Ensures critical skills contribute proportionally to candidate evaluation.
* **Speaker Notes:**
  > *"When candidates make minor typos or use naming variants, our Levenshtein DP table identifies fuzzy matches. Finally, our Max-Heap prioritizes requirements by importance weight."*

---

## Slide 10: Algorithm Performance Lab (Empirical Benchmarks)
* **Real CPU Execution Timing:**
  * Uses Python's `time.perf_counter()` on the host CPU (zero hardcoded numbers).
  * Dataset sizes: **100**, **1,000**, **10,000**, and **50,000** items.
  * Compares: **Linear Search vs. HashMap vs. Trie** and **Naive Search vs. KMP vs. Rabin-Karp**.
  * Measures real speedup multipliers ($20\times - 100\times$ faster over linear search).
* **Hardware Transparency:**
  * Mandatory disclaimer: *"Benchmark results depend on the user's hardware, Python version, dataset, and implementation."*
* **Speaker Notes:**
  > *"We built an empirical benchmarking laboratory directly into the application. We measure actual microsecond latency across 100 to 50,000 items, proving the theoretical time complexity curves on real hardware."*

---

## Slide 11: Technology Stack & Implementation
* **Backend:** FastAPI, Python 3.13, Uvicorn, Pydantic, pdfplumber, pypdfium2.
* **Frontend:** React 18, Vite, Tailwind CSS, Lucide Icons, Canvas Confetti.
* **Engineering Best Practices:**
  * Strict separation of algorithms, pipeline, and benchmark modules.
  * Decoupled client-server REST API.
  * Production bundle under 370 kB gzip-ready.
* **Speaker Notes:**
  > *"The tech stack combines a FastAPI Python backend with a React and Vite frontend styled in modern dark-mode glassmorphism. It runs with zero external API dependencies."*

---

## Slide 12: Summary of Achievements & Future Roadmap
* **Key Achievements:**
  * Complete, portfolio-grade project ready for presentations, hackathons, and interviews.
  * 100% deterministic, explainable, and auditable match engine.
  * 6 visual DSA laboratories with step-by-step animations.
  * Live empirical CPU benchmarking laboratory.
* **Future Roadmap:**
  * Multi-resume concurrent batch processing.
  * Knowledge graph skill ontologies.
  * Exportable PDF audit dossiers.
* **Speaker Notes:**
  > *"In summary, ResumeIQ demonstrates how classic Data Structures & Algorithms can solve modern problems with transparency, speed, and mathematical rigor. Our future roadmap includes batch parsing and skill knowledge graphs."*

---

## Slide 13: Conclusion / Q&A Slide
* **Thank You!**
* **Web App:** `http://localhost:5173`
* **Backend API & Docs:** `http://127.0.0.1:8000/docs`
* **Open for Questions & Live Demonstration!**
