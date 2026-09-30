"""
Rabin-Karp String Matching Algorithm with Rolling Hash & Collision Verification Tracing.
Average Time Complexity: O(N + M)
Worst Time Complexity: O(N * M)
Space Complexity: O(1)
"""

from typing import List, Dict, Any


def rabin_karp_search(text: str, pattern: str, prime_base: int = 256, prime_mod: int = 101) -> Dict[str, Any]:
    """
    Executes the Rabin-Karp algorithm with rolling hash.
    Records sliding window transitions, hash calculations, and collision verification checks.
    """
    if not pattern or not text or len(pattern) > len(text):
        return {
            "text": text,
            "pattern": pattern,
            "matches": [],
            "pattern_hash": 0,
            "steps": [],
            "collisions": 0,
            "time_complexity": "O(N + M) expected",
            "space_complexity": "O(1)"
        }

    n = len(text)
    m = len(pattern)
    d = prime_base
    q = prime_mod

    p_hash = 0  # hash value for pattern
    t_hash = 0  # hash value for current text window
    h = 1       # d^(m-1) % q

    # The value of h would be "pow(d, m-1)%q"
    for _ in range(m - 1):
        h = (h * d) % q

    # Calculate initial hash value of pattern and first window of text
    for i in range(m):
        p_hash = (d * p_hash + ord(pattern[i].lower())) % q
        t_hash = (d * t_hash + ord(text[i].lower())) % q

    matches = []
    steps = []
    collisions = 0

    steps.append({
        "step": 1,
        "action": "INIT_HASH",
        "pattern_hash": p_hash,
        "first_window_hash": t_hash,
        "formula": f"Hash computed using polynomial base {d} mod {q}",
        "message": f"Calculated Pattern Hash: {p_hash}. Initial Text Window [0..{m-1}] ('{text[:m]}') Hash: {t_hash}"
    })

    # Slide the pattern over text one by one
    for i in range(n - m + 1):
        current_window_text = text[i:i + m]
        hashes_match = (p_hash == t_hash)
        is_exact_match = False
        is_spurious_hit = False

        if hashes_match:
            # Check characters one by one to rule out hash collision
            exact_chars = True
            for j in range(m):
                if text[i + j].lower() != pattern[j].lower():
                    exact_chars = False
                    break

            if exact_chars:
                is_exact_match = True
                matches.append(i)
            else:
                is_spurious_hit = True
                collisions += 1

        steps.append({
            "step": len(steps) + 1,
            "window_index": i,
            "window_text": current_window_text,
            "pattern": pattern,
            "window_hash": t_hash,
            "pattern_hash": p_hash,
            "hash_matched": hashes_match,
            "exact_matched": is_exact_match,
            "is_collision": is_spurious_hit,
            "action": "MATCH_FOUND" if is_exact_match else ("HASH_COLLISION" if is_spurious_hit else "HASH_MISMATCH"),
            "message": (
                f"Window [{i}..{i+m-1}] '{current_window_text}' -> Hashes match ({t_hash} == {p_hash})! "
                f"{'Verified exact match ✓' if is_exact_match else 'Collision detected ✕ (hash equal, chars differ)'}"
                if hashes_match else
                f"Window [{i}..{i+m-1}] '{current_window_text}' -> Hash mismatch ({t_hash} != {p_hash}). Slide window."
            )
        })

        # Calculate hash value for next window of text: Remove leading digit, add trailing digit
        if i < n - m:
            t_hash = (d * (t_hash - ord(text[i].lower()) * h) + ord(text[i + m].lower())) % q
            if t_hash < 0:
                t_hash += q

    return {
        "text": text,
        "pattern": pattern,
        "matches": matches,
        "pattern_hash": p_hash,
        "prime_mod": q,
        "prime_base": d,
        "steps": steps,
        "total_windows_checked": n - m + 1,
        "collisions_count": collisions,
        "time_complexity": f"O(N + M) = O({n} + {m}) expected",
        "space_complexity": "O(1) auxiliary",
        "explanation": f"Rabin-Karp checked {n - m + 1} sliding windows in expected O(N+M) time with {collisions} hash collisions."
    }
