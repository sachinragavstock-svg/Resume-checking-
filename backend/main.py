"""
ResumeIQ - DSA-Driven Resume Matcher & Algorithm Lab Backend API.
Built with FastAPI.
"""

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import json
import sys
from pathlib import Path

# Ensure project root and backend dir are in sys.path for robust module resolution
_backend_dir = Path(__file__).resolve().parent
_project_root = _backend_dir.parent
if str(_project_root) not in sys.path:
    sys.path.insert(0, str(_project_root))
if str(_backend_dir) not in sys.path:
    sys.path.insert(0, str(_backend_dir))

import uvicorn

from backend.pipeline.match_engine import run_full_pipeline
from backend.pipeline.parser import parse_document
from backend.algorithms.hash_map import CustomHashMap
from backend.algorithms.trie import CustomTrie
from backend.algorithms.kmp import kmp_search
from backend.algorithms.rabin_karp import rabin_karp_search
from backend.algorithms.edit_distance import compute_edit_distance
from backend.algorithms.ranking import calculate_weighted_match_score
from backend.benchmark.benchmark_engine import run_benchmarks

app = FastAPI(
    title="ResumeIQ API",
    description="DSA-Driven Resume Matching Engine, Interactive Algorithm Laboratory & Performance Benchmarks",
    version="1.0.0"
)

# Enable CORS for frontend dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Realistic Demo Sample Data as specified in Section 20
DEMO_RESUME_TEXT = """
Alex Chen
Senior Software Engineer
Email: alex.chen@example.com | GitHub: github.com/alexchen | Location: San Francisco, CA

PROFESSIONAL SUMMARY:
Results-driven software engineer with 5+ years of experience developing high-performance web applications, distributed systems, and machine learning pipelines. Strong foundation in data structures, algorithms, and system design.

TECHNICAL SKILLS:
- Programming Languages: Python (4 yrs), Java (3 yrs), SQL (3 yrs), JavaScript, C++
- Frontend & UI: React (2 yrs), HTML5, CSS3, Tailwind CSS
- Data & Machine Learning: Machine Learning, Scikit-Learn, Pandas, NumPy, Data Structures, Algorithms
- Tools & Version Control: Git, GitHub, Linux, REST API

WORK EXPERIENCE:
Senior Software Engineer | TechCore Solutions (2021 - Present)
- Architected and scaled backend microservices using Python and Java, serving 500k+ daily active users.
- Designed responsive user interfaces in React, reducing page load latency by 35%.
- Implemented machine learning classification models in Python to automate document categorization with 94% accuracy.
- Optimized complex SQL queries and relational database schemas, cutting query response time by 45%.
- Managed team Git workflows, continuous integration pipelines, and code reviews.

Software Developer | DataFlow Labs (2019 - 2021)
- Developed REST APIs in Python and Java for real-time telemetry streaming.
- Built reusable React frontend components and state management modules.
- Utilized Git for version control and automated testing suites.
"""

DEMO_JOB_DESCRIPTION = """
Senior Full-Stack & Systems Engineer

We are looking for an exceptional Senior Software Engineer to join our core infrastructure and web platform team.

Key Responsibilities:
- Design, build, and maintain high-performance, fault-tolerant backend services and APIs.
- Build modern, interactive user interfaces with responsive state management.
- Containerize and orchestrate microservices across distributed cloud infrastructure.
- Develop and deploy predictive machine learning services and data pipelines.

Requirements:
- Strong proficiency in Python and Java programming languages (Required - 10 pts)
- Proven experience building rich client-side applications with React (Required - 10 pts)
- Hands-on expertise with AWS cloud infrastructure (EC2, S3, RDS) (Required - 10 pts)
- Production experience with Docker containerization and container lifecycles (Required - 10 pts)
- Solid understanding of SQL and relational database modeling (Required - 8 pts)
- Experience with Kubernetes cluster orchestration and deployment (Preferred - 6 pts)
- Background in Machine Learning models, pipelines, and evaluation (Preferred - 6 pts)
"""


class AnalyzeRequest(BaseModel):
    resume_text: str
    job_description_text: str
    custom_weights: Optional[Dict[str, float]] = None


class RecalculateWeightsRequest(BaseModel):
    requirements: List[Dict[str, Any]]
    custom_weights: Dict[str, float]


class HashMapLabRequest(BaseModel):
    items: Optional[List[Dict[str, Any]]] = None
    search_key: str


class TrieLabRequest(BaseModel):
    words: Optional[List[str]] = None
    search_word: Optional[str] = None
    prefix: Optional[str] = None
    autocomplete_prefix: Optional[str] = None


class StringMatchRequest(BaseModel):
    text: str
    pattern: str


class EditDistanceRequest(BaseModel):
    word1: str
    word2: str


# =================================================================
# 1. LIVE MATCH ENGINE & DEMO ENDPOINTS
# =================================================================

@app.post("/api/analyze")
async def analyze_match(payload: AnalyzeRequest):
    """Executes the full 7-stage live match pipeline."""
    try:
        result = run_full_pipeline(
            resume_text=payload.resume_text,
            job_description_text=payload.job_description_text,
            custom_weights=payload.custom_weights
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/analyze-file")
async def analyze_file_match(
    file: UploadFile = File(...),
    job_description_text: str = Form(...),
    custom_weights_json: Optional[str] = Form(None)
):
    """Handles PDF / TXT / MD file upload and executes analysis."""
    try:
        content_bytes = await file.read()
        parsed = parse_document(file_bytes=content_bytes, filename=file.filename)
        weights = json.loads(custom_weights_json) if custom_weights_json else None

        result = run_full_pipeline(
            resume_text=parsed["raw_text"],
            job_description_text=job_description_text,
            custom_weights=weights
        )
        result["uploaded_filename"] = file.filename
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/demo")
async def get_demo_analysis():
    """Returns realistic sample dataset and executes full live pipeline for Section 20 demonstration."""
    result = run_full_pipeline(
        resume_text=DEMO_RESUME_TEXT,
        job_description_text=DEMO_JOB_DESCRIPTION
    )
    result["demo_resume_text"] = DEMO_RESUME_TEXT
    result["demo_job_description"] = DEMO_JOB_DESCRIPTION
    return result


@app.post("/api/recalculate-weights")
async def recalculate_weights_endpoint(payload: RecalculateWeightsRequest):
    """Recalculates match score dynamically when user adjusts requirement weights."""
    return calculate_weighted_match_score(
        requirements=payload.requirements,
        custom_weights=payload.custom_weights
    )


# =================================================================
# 2. INTERACTIVE DSA LAB ENDPOINTS
# =================================================================

@app.post("/api/dsa/hashmap")
async def hashmap_lab_endpoint(payload: HashMapLabRequest):
    hm = CustomHashMap(initial_capacity=16)
    
    # Default items if none passed
    default_items = [
        {"key": "Python", "value": 4},
        {"key": "Java", "value": 3},
        {"key": "React", "value": 2},
        {"key": "SQL", "value": 2},
        {"key": "Git", "value": 3},
        {"key": "C++", "value": 1},
        {"key": "JavaScript", "value": 2}
    ]
    items_to_insert = payload.items if payload.items else default_items
    for it in items_to_insert:
        hm.put(it["key"], it["value"])

    trace = hm.trace_lookup(payload.search_key)
    structure = hm.get_structure_view()

    return {
        "search_key": payload.search_key,
        "trace": trace,
        "bucket_structure": structure,
        "total_keys": hm.size,
        "capacity": hm.capacity
    }


@app.post("/api/dsa/trie")
async def trie_lab_endpoint(payload: TrieLabRequest):
    trie = CustomTrie()
    default_words = ["PYTHON", "PYTORCH", "PANDAS", "POSTGRESQL", "PROMETHEUS", "JAVA", "JAVASCRIPT", "REACT", "REDIS", "RUST"]
    words_to_insert = payload.words if payload.words else default_words

    for w in words_to_insert:
        trie.insert(w)

    search_result = trie.search(payload.search_word) if payload.search_word else None
    prefix_result = trie.starts_with(payload.prefix) if payload.prefix else None
    autocomplete_result = trie.autocomplete(payload.autocomplete_prefix) if payload.autocomplete_prefix else []

    return {
        "words_in_trie": words_to_insert,
        "tree_hierarchy": trie.to_tree_hierarchy(max_depth=5),
        "search_result": search_result,
        "prefix_result": prefix_result,
        "autocomplete_suggestions": autocomplete_result
    }


@app.post("/api/dsa/kmp")
async def kmp_lab_endpoint(payload: StringMatchRequest):
    return kmp_search(payload.text, payload.pattern)


@app.post("/api/dsa/rabinkarp")
async def rabin_karp_lab_endpoint(payload: StringMatchRequest):
    return rabin_karp_search(payload.text, payload.pattern)


@app.post("/api/dsa/editdistance")
async def edit_distance_lab_endpoint(payload: EditDistanceRequest):
    return compute_edit_distance(payload.word1, payload.word2)


# =================================================================
# 3. ALGORITHM PERFORMANCE LAB (BENCHMARKS)
# =================================================================

@app.get("/api/benchmark")
async def benchmark_endpoint(size: int = 1000):
    return run_benchmarks(dataset_size=size)


if __name__ == "__main__":
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=True)
