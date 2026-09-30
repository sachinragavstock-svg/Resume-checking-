"""
Real Algorithm Performance & Benchmark Laboratory Engine.
Executes real timing benchmarks using time.perf_counter() across dataset sizes (100, 1000, 10000, 50000).
Never hardcodes results; measures actual CPU execution time on the host machine.
"""

import time
import random
import string
from typing import Dict, Any, List, Tuple

from backend.algorithms.hash_map import CustomHashMap
from backend.algorithms.trie import CustomTrie
from backend.algorithms.kmp import kmp_search
from backend.algorithms.rabin_karp import rabin_karp_search

# Standard realistic vocabulary pool for synthetic corpus generation
COMMON_VOCAB = [
    "python", "javascript", "typescript", "react", "angular", "vue", "docker", "kubernetes",
    "aws", "azure", "gcp", "sql", "postgresql", "mysql", "mongodb", "redis", "kafka",
    "microservices", "systemdesign", "graphql", "restapi", "algorithms", "datastructures",
    "machinelearning", "deeplearning", "pytorch", "tensorflow", "ci_cd", "linux", "golang",
    "rust", "cpp", "java", "springboot", "django", "fastapi", "flask", "pandas", "numpy",
    "security", "encryption", "networking", "concurrency", "multithreading", "distributed"
]


def generate_synthetic_dataset(size: int) -> Tuple[List[str], str]:
    """Generates a synthetic dataset with `size` unique words and a random target search word."""
    words = []
    for i in range(size):
        base = COMMON_VOCAB[i % len(COMMON_VOCAB)]
        suffix = f"_{i}" if i >= len(COMMON_VOCAB) else ""
        words.append(f"{base}{suffix}")

    # Pick a search target near the end or middle to simulate realistic search
    target_idx = int(size * 0.75) % size
    search_target = words[target_idx]
    return words, search_target


def run_linear_search(words: List[str], target: str) -> bool:
    for word in words:
        if word == target:
            return True
    return False


def run_naive_string_search(text: str, pattern: str) -> List[int]:
    n = len(text)
    m = len(pattern)
    matches = []
    for i in range(n - m + 1):
        if text[i:i + m] == pattern:
            matches.append(i)
    return matches


def run_benchmarks(dataset_size: int = 1000, trials: int = 5) -> Dict[str, Any]:
    """
    Executes actual live performance benchmarks for Search (Linear vs HashMap vs Trie)
    and String Matching (Naive vs KMP vs Rabin-Karp) using time.perf_counter().
    """
    valid_sizes = [100, 1000, 10000, 50000]
    size = dataset_size if dataset_size in valid_sizes else 1000

    words, target = generate_synthetic_dataset(size)

    # -------------------------------------------------------------
    # 1. SETUP DATA STRUCTURES
    # -------------------------------------------------------------
    t_start_setup = time.perf_counter()
    hm = CustomHashMap(initial_capacity=max(16, size // 2))
    for w in words:
        hm.put(w, 1)

    trie = CustomTrie()
    for w in words:
        trie.insert(w)
    setup_time_ms = round((time.perf_counter() - t_start_setup) * 1000, 3)

    # -------------------------------------------------------------
    # 2. BENCHMARK SEARCH ALGORITHMS (Linear vs HashMap vs Trie)
    # -------------------------------------------------------------
    # Repeat lookups over trials to get stable, precise timing
    
    # Linear Search
    t0 = time.perf_counter()
    for _ in range(trials):
        _ = run_linear_search(words, target)
    t_linear_sec = (time.perf_counter() - t0) / trials
    t_linear_us = round(t_linear_sec * 1_000_000, 2)

    # HashMap Lookup
    t0 = time.perf_counter()
    for _ in range(trials * 10):  # higher iteration for microsecond accuracy
        _ = hm.get(target)
    t_hashmap_sec = (time.perf_counter() - t0) / (trials * 10)
    t_hashmap_us = round(t_hashmap_sec * 1_000_000, 2)

    # Trie Search
    t0 = time.perf_counter()
    for _ in range(trials * 10):
        _ = trie.search(target)
    t_trie_sec = (time.perf_counter() - t0) / (trials * 10)
    t_trie_us = round(t_trie_sec * 1_000_000, 2)

    # Calculate Speedups relative to Linear
    base_us = max(0.01, t_linear_us)
    hashmap_speedup = round(base_us / max(0.01, t_hashmap_us), 1)
    trie_speedup = round(base_us / max(0.01, t_trie_us), 1)

    search_benchmark_results = [
        {
            "algorithm": "Linear Search",
            "time_us": t_linear_us,
            "time_ms": round(t_linear_us / 1000, 4),
            "complexity": "O(N)",
            "speedup": "1.0x (Baseline)",
            "operations_estimate": f"~{int(size * 0.75)} checks",
            "bar_percentage": 100.0,
            "color": "#ef4444"
        },
        {
            "algorithm": "Custom HashMap",
            "time_us": t_hashmap_us,
            "time_ms": round(t_hashmap_us / 1000, 4),
            "complexity": "O(1) average",
            "speedup": f"{hashmap_speedup}x faster",
            "operations_estimate": "1 hash + 1 bucket check",
            "bar_percentage": max(2.0, min(100.0, round((t_hashmap_us / base_us) * 100, 2))),
            "color": "#10b981"
        },
        {
            "algorithm": "Custom Trie (Prefix Tree)",
            "time_us": t_trie_us,
            "time_ms": round(t_trie_us / 1000, 4),
            "complexity": f"O(L) = O({len(target)})",
            "speedup": f"{trie_speedup}x faster",
            "operations_estimate": f"{len(target)} character node hops",
            "bar_percentage": max(3.0, min(100.0, round((t_trie_us / base_us) * 100, 2))),
            "color": "#6366f1"
        }
    ]

    # -------------------------------------------------------------
    # 3. BENCHMARK STRING MATCHING (Naive vs KMP vs Rabin-Karp)
    # -------------------------------------------------------------
    # Construct a repeated text corpus of roughly size * 10 characters
    corpus_text = " ".join(words * max(1, 2000 // size))
    pattern = "kubernetes" if "kubernetes" in corpus_text else words[0]

    # Naive String Search
    t0 = time.perf_counter()
    naive_matches = run_naive_string_search(corpus_text, pattern)
    t_naive_us = round((time.perf_counter() - t0) * 1_000_000, 2)

    # KMP Search
    t0 = time.perf_counter()
    kmp_res = kmp_search(corpus_text, pattern)
    t_kmp_us = round((time.perf_counter() - t0) * 1_000_000, 2)

    # Rabin-Karp Search
    t0 = time.perf_counter()
    rk_res = rabin_karp_search(corpus_text, pattern)
    t_rk_us = round((time.perf_counter() - t0) * 1_000_000, 2)

    naive_base = max(0.01, t_naive_us)
    string_benchmark_results = [
        {
            "algorithm": "Naive String Search",
            "time_us": t_naive_us,
            "time_ms": round(t_naive_us / 1000, 4),
            "complexity": "O(N × M)",
            "speedup": "1.0x (Baseline)",
            "matches_found": len(naive_matches),
            "bar_percentage": 100.0,
            "color": "#f59e0b"
        },
        {
            "algorithm": "Knuth-Morris-Pratt (KMP)",
            "time_us": t_kmp_us,
            "time_ms": round(t_kmp_us / 1000, 4),
            "complexity": "O(N + M)",
            "speedup": f"{round(naive_base / max(0.01, t_kmp_us), 1)}x",
            "matches_found": len(kmp_res["matches"]),
            "bar_percentage": max(2.0, min(100.0, round((t_kmp_us / naive_base) * 100, 2))),
            "color": "#06b6d4"
        },
        {
            "algorithm": "Rabin-Karp (Rolling Hash)",
            "time_us": t_rk_us,
            "time_ms": round(t_rk_us / 1000, 4),
            "complexity": "O(N + M) expected",
            "speedup": f"{round(naive_base / max(0.01, t_rk_us), 1)}x",
            "matches_found": len(rk_res["matches"]),
            "bar_percentage": max(2.0, min(100.0, round((t_rk_us / naive_base) * 100, 2))),
            "color": "#a855f7"
        }
    ]

    return {
        "dataset_size": size,
        "search_target": target,
        "corpus_length_chars": len(corpus_text),
        "pattern_searched": pattern,
        "setup_time_ms": setup_time_ms,
        "search_benchmarks": search_benchmark_results,
        "string_benchmarks": string_benchmark_results,
        "disclaimer": "Benchmark results depend on the user's hardware, Python version, dataset, and implementation."
    }
