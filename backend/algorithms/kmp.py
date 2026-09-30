"""
Knuth-Morris-Pratt (KMP) String Matching Algorithm with LPS Construction & Step-by-Step Visualization Tracing.
Time Complexity: O(N + M) where N = len(text), M = len(pattern)
Space Complexity: O(M) for LPS array
"""

from typing import List, Dict, Any, Tuple


def compute_lps_array(pattern: str) -> Tuple[List[int], List[Dict[str, Any]]]:
    """
    Computes the Longest Proper Prefix which is also Suffix (LPS) array for pattern.
    Returns (lps_array, lps_computation_steps).
    """
    m = len(pattern)
    lps = [0] * m
    length = 0
    i = 1
    steps = []

    steps.append({
        "step": 0,
        "action": "INIT",
        "i": 0,
        "length": 0,
        "lps_state": list(lps),
        "message": f"Initialized LPS array of length {m} with zeros. lps[0] = 0."
    })

    while i < m:
        if pattern[i] == pattern[length]:
            length += 1
            lps[i] = length
            steps.append({
                "step": len(steps) + 1,
                "action": "MATCH",
                "i": i,
                "length": length,
                "char_i": pattern[i],
                "char_len": pattern[length - 1],
                "lps_state": list(lps),
                "message": f"pattern[{i}] ('{pattern[i]}') == pattern[{length-1}] ('{pattern[length-1]}') -> Match! Set lps[{i}] = {length}"
            })
            i += 1
        else:
            if length != 0:
                old_len = length
                length = lps[length - 1]
                steps.append({
                    "step": len(steps) + 1,
                    "action": "FALLBACK",
                    "i": i,
                    "length": length,
                    "old_length": old_len,
                    "char_i": pattern[i],
                    "char_len": pattern[old_len],
                    "lps_state": list(lps),
                    "message": f"Mismatch at pattern[{i}] ('{pattern[i]}') != pattern[{old_len}] ('{pattern[old_len]}'). Fallback length to lps[{old_len-1}] = {length}"
                })
            else:
                lps[i] = 0
                steps.append({
                    "step": len(steps) + 1,
                    "action": "NO_PREFIX",
                    "i": i,
                    "length": 0,
                    "char_i": pattern[i],
                    "lps_state": list(lps),
                    "message": f"Mismatch at pattern[{i}] ('{pattern[i]}') and length == 0 -> Set lps[{i}] = 0"
                })
                i += 1

    return lps, steps


def kmp_search(text: str, pattern: str) -> Dict[str, Any]:
    """
    Executes KMP string search algorithm and records full step-by-step trace for visualization.
    """
    if not pattern or not text:
        return {
            "text": text,
            "pattern": pattern,
            "matches": [],
            "lps": [],
            "lps_steps": [],
            "search_steps": [],
            "comparisons": 0,
            "time_complexity": "O(N + M)",
            "space_complexity": "O(M)"
        }

    lps, lps_steps = compute_lps_array(pattern)
    n = len(text)
    m = len(pattern)

    i = 0  # index for text
    j = 0  # index for pattern
    matches = []
    search_steps = []
    comparisons = 0

    while i < n:
        comparisons += 1
        is_char_match = (text[i].lower() == pattern[j].lower())

        search_steps.append({
            "step": len(search_steps) + 1,
            "text_index": i,
            "pattern_index": j,
            "text_char": text[i],
            "pattern_char": pattern[j],
            "is_match": is_char_match,
            "window_start": i - j,
            "window_end": i - j + m,
            "action": "CHAR_MATCH" if is_char_match else "CHAR_MISMATCH",
            "message": f"Compare text[{i}] ('{text[i]}') vs pattern[{j}] ('{pattern[j]}') -> {'MATCH ✓' if is_char_match else 'MISMATCH ✕'}"
        })

        if is_char_match:
            i += 1
            j += 1

        if j == m:
            start_idx = i - j
            matches.append(start_idx)
            search_steps.append({
                "step": len(search_steps) + 1,
                "text_index": i - 1,
                "pattern_index": j - 1,
                "action": "FULL_PATTERN_MATCH",
                "match_start_index": start_idx,
                "match_text": text[start_idx:start_idx + m],
                "message": f"🎯 FULL PATTERN FOUND at text index {start_idx}..{start_idx + m - 1}! Next pattern jump using lps[{m-1}] = {lps[m-1]}"
            })
            j = lps[m - 1]
        elif i < n and text[i].lower() != pattern[j].lower():
            if j != 0:
                old_j = j
                j = lps[j - 1]
                search_steps.append({
                    "step": len(search_steps) + 1,
                    "text_index": i,
                    "pattern_index": j,
                    "old_pattern_index": old_j,
                    "action": "LPS_JUMP",
                    "message": f"LPS intelligent skip: shift pattern index from {old_j} to lps[{old_j-1}] = {j}. Skip redundant comparisons!"
                })
            else:
                i += 1

    return {
        "text": text,
        "pattern": pattern,
        "matches": matches,
        "lps": lps,
        "lps_steps": lps_steps,
        "search_steps": search_steps,
        "total_comparisons": comparisons,
        "naive_comparisons_estimate": n * m,
        "efficiency_gain": round((1 - (comparisons / max(1, n * m))) * 100, 1) if (n * m) > 0 else 0,
        "time_complexity": f"O(N + M) = O({n} + {m})",
        "space_complexity": f"O(M) = O({m})",
        "explanation": f"KMP found {len(matches)} occurrences with only {comparisons} character comparisons using the LPS table."
    }
