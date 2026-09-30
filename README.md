# ResumeIQ — DSA-Driven Resume Match Engine & Algorithm Laboratory

A high-performance, deterministic resume matching platform and interactive Data Structures & Algorithms laboratory. Built with **FastAPI (Python)** and **React + Vite + Tailwind CSS**.

---

## 🚀 Key Features

### 1. ⚡ Live Match Engine Pipeline (7 Deterministic Stages)
- **Sequential Animation**: `RESUME` → `TEXT EXTRACTION` → `KEYWORD MAP` → `TRIE SEARCH` → `STRING MATCHING` → `REQUIREMENT WEIGHTS` → `MATCH SCORE`.
- **Stage Inspector**: Click any stage card to inspect its internal state (HashMap frequencies, chaining buckets, Trie traversal path, KMP/Rabin-Karp match indices, DP Levenshtein matrices).
- **Mathematical Derivation Strip**: Direct visual proof displaying $\frac{\text{Matched Weight}}{\text{Total Weight}} \times 100 = \text{Score}\%$.

### 2. 🔍 "How Was This Score Calculated?" Explainability Panel
- Itemized breakdown for every target job requirement with matching method (Exact HashMap, Alias Normalization, KMP Substring, Fuzzy Edit Distance, or Missing).
- Interactive weight sliders for live what-if scoring scenarios.

### 3. ⚔️ Resume vs Job "Battle View"
- Side-by-side combat alignment matrix with filters (`ALL`, `MATCHED 🟢`, `MISSING 🔴`, `PARTIAL 🟠`, `REQUIRED`).
- Highlights extra skills present in resume categorized as `NOT RELEVANT / BONUS`.

### 4. 🧪 Interactive DSA Laboratory
- **HashMap Lab**: Key-frequency table, animated `INPUT` → `HASH` → `BUCKET` → `VALUE`, $O(1)$ avg lookup complexity, separate chaining buckets.
- **Trie Lab**: Word insertion, prefix traversal (`ROOT` → `P` → `Y` → `T` → `H` → `O` → `N` ✓), prefix autocomplete suggestions, $O(L)$ search complexity.
- **KMP Lab**: Target text + pattern, LPS table display, animated character comparisons with $i$ and $j$ pointers, $O(N + M)$ complexity.
- **Rabin-Karp Lab**: Rolling hash sliding window, pattern hash, collision counter & character verification, $O(N + M)$ expected complexity.
- **Edit Distance Lab**: Dynamic programming matrix calculation, cell-by-cell animation, backtrace path, $O(N \times M)$ complexity.
- **Ranking Lab**: Priority Max-Heap ranking, live weight sliders, score changes in real time, $O(K \log K)$ complexity.

### 5. 📊 Algorithm Performance Lab (Benchmarks)
- Measures CPU execution time using Python's `time.perf_counter()` across dataset sizes ($100$, $1,000$, $10,000$, $50,000$).
- Compares **Linear Search vs Custom HashMap vs Custom Trie** and **Naive String Search vs KMP vs Rabin-Karp**.
- Displays interactive comparison bar charts, latency in microseconds ($\mu s$), and speedup multipliers.

---

## 🛠️ How to Run the Project

### 1. Start the Backend API (FastAPI)
Open a terminal in the project root:
```bash
# Activate your python virtual environment if applicable
uvicorn backend.main:app --reload --port 8000
```
Backend will be live at: `http://127.0.0.1:8000` (API Docs at `http://127.0.0.1:8000/docs`).

### 2. Start the Frontend (React + Vite)
Open another terminal:
```bash
cd frontend
npm install
npm run dev
```
Frontend will be live at: `http://localhost:5173`.

---

## 🏛️ System Architecture

```
RESUME INPUT
     │
     ↓
TEXT EXTRACTION (pdfplumber / raw stream)
     │
     ↓
TEXT NORMALIZATION (Alias taxonomy mapping)
     │
     ├───────────────────────┐
     ↓                       ↓
HASHMAP (O(1) lookup)    TRIE (O(L) prefix)
     │                       │
     └───────────┬───────────┘
                 ↓
      STRING MATCHING ENGINE
     ┌───────────┼───────────┐
     ↓           ↓           ↓
    KMP      RABIN-KARP   EDIT DISTANCE
  O(n+m)    O(n+m) exp       O(nm)
     │           │           │
     └───────────┼───────────┘
                 ↓
        REQUIREMENT WEIGHTS
                 ↓
      WEIGHTED RANKING (HEAP)
                 ↓
        MATCH ENGINE SCORING
     ┌───────────┼───────────┐
     ↓           ↓           ↓
   SCORE      BATTLE       REPORT
```
