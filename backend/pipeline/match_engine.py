"""
Complete 7-Stage Live Match Engine Pipeline.
Coordinates HashMap, Trie, KMP, Rabin-Karp, Edit Distance, and Weighted Ranking.
All intermediate stage states are preserved for frontend inspection.
"""

from typing import Dict, Any, List, Optional
import time
import math

from backend.algorithms.hash_map import CustomHashMap
from backend.algorithms.trie import CustomTrie
from backend.algorithms.kmp import kmp_search
from backend.algorithms.rabin_karp import rabin_karp_search
from backend.algorithms.edit_distance import compute_edit_distance
from backend.algorithms.ranking import calculate_weighted_match_score
from backend.pipeline.parser import parse_document
from backend.pipeline.normalizer import extract_skills_and_tokens, normalize_token, SKILL_CATEGORIES, KNOWN_ALIASES


def run_full_pipeline(
    resume_text: str,
    job_description_text: str,
    custom_weights: Optional[Dict[str, float]] = None,
    job_requirements_override: Optional[List[Dict[str, Any]]] = None
) -> Dict[str, Any]:
    """
    Executes the comprehensive 7-stage deterministic DSA analysis pipeline.
    """
    pipeline_start_time = time.perf_counter()
    stages = []

    # -------------------------------------------------------------
    # STAGE 1: TEXT EXTRACTION
    # -------------------------------------------------------------
    resume_parsed = parse_document(raw_text=resume_text)
    job_parsed = parse_document(raw_text=job_description_text)

    stage_1_data = {
        "stage_id": 1,
        "stage_name": "TEXT EXTRACTION",
        "icon": "FileText",
        "description": "Extract raw characters, lines, and structural tokens from input documents.",
        "status": "COMPLETED",
        "resume_stats": {
            "characters": resume_parsed["char_count"],
            "words": resume_parsed["word_count"],
            "lines": resume_parsed["line_count"],
            "sample_snippet": (resume_text[:280] + "...") if len(resume_text) > 280 else resume_text
        },
        "job_stats": {
            "characters": job_parsed["char_count"],
            "words": job_parsed["word_count"],
            "lines": job_parsed["line_count"],
            "sample_snippet": (job_description_text[:280] + "...") if len(job_description_text) > 280 else job_description_text
        }
    }
    stages.append(stage_1_data)

    # -------------------------------------------------------------
    # STAGE 2: TEXT NORMALIZATION & ALIAS MAPPING
    # -------------------------------------------------------------
    resume_norm = extract_skills_and_tokens(resume_text)
    job_norm = extract_skills_and_tokens(job_description_text)

    stage_2_data = {
        "stage_id": 2,
        "stage_name": "TEXT NORMALIZATION",
        "icon": "Filter",
        "description": "Clean tokens, remove stopwords, and normalize aliases via technical taxonomy.",
        "status": "COMPLETED",
        "resume_tokens_count": resume_norm["raw_token_count"],
        "resume_filtered_tokens": resume_norm["filtered_tokens"][:40],
        "alias_mappings_found": resume_norm["alias_replacements"],
        "job_detected_skills": list(job_norm["detected_skills"].keys())
    }
    stages.append(stage_2_data)

    # -------------------------------------------------------------
    # STAGE 3: KEYWORD FREQUENCY HASHMAP
    # -------------------------------------------------------------
    resume_hashmap = CustomHashMap(initial_capacity=16)
    
    # Insert detected skills and filtered tokens into custom HashMap
    for skill_name, count in resume_norm["detected_skills"].items():
        resume_hashmap.put(skill_name, count)

    for tok in resume_norm["filtered_tokens"]:
        tok_norm = normalize_token(tok)
        if not resume_hashmap.contains(tok_norm):
            resume_hashmap.put(tok_norm, 1)

    hashmap_freq_list = []
    for k, v in resume_hashmap.to_dict().items():
        hashmap_freq_list.append({"key": k, "frequency": v, "category": SKILL_CATEGORIES.get(k, "General")})
    hashmap_freq_list.sort(key=lambda x: x["frequency"], reverse=True)

    stage_3_data = {
        "stage_id": 3,
        "stage_name": "KEYWORD MAP (HASHMAP)",
        "icon": "Hash",
        "description": "Construct frequency table and separate chaining buckets with O(1) average lookup.",
        "status": "COMPLETED",
        "total_unique_keys": resume_hashmap.size,
        "capacity": resume_hashmap.capacity,
        "top_frequencies": hashmap_freq_list[:15],
        "buckets_preview": resume_hashmap.get_structure_view()[:8],
        "time_complexity": "O(1) Average Lookup / Insert"
    }
    stages.append(stage_3_data)

    # -------------------------------------------------------------
    # STAGE 4: TRIE INDEXING & SEARCH
    # -------------------------------------------------------------
    resume_trie = CustomTrie()
    for item in hashmap_freq_list:
        resume_trie.insert(item["key"], value=item["frequency"])

    trie_search_traces = []
    # Identify target job skills
    target_job_skills = list(job_norm["detected_skills"].keys())
    if not target_job_skills:
        # If no predefined canonical skill matched, parse uppercase / capitalized words from job
        import re
        words = re.findall(r'\b[A-Z][a-zA-Z0-9\+#\.]+\b', job_description_text)
        target_job_skills = list(set([normalize_token(w) for w in words if len(w) > 1]))[:12]

    for req_skill in target_job_skills[:8]:
        search_res = resume_trie.search(req_skill)
        trie_search_traces.append({
            "skill": req_skill,
            "found": search_res["found"],
            "path": " → ".join(search_res["path"]),
            "node_count": len(search_res["node_ids"]),
            "time_complexity": search_res["time_complexity"]
        })

    stage_4_data = {
        "stage_id": 4,
        "stage_name": "TRIE SEARCH (PREFIX TREE)",
        "icon": "GitBranch",
        "description": "Index resume keywords in a prefix tree to execute deterministic O(L) searches.",
        "status": "COMPLETED",
        "trie_word_count": resume_trie.word_count,
        "search_traces": trie_search_traces,
        "tree_hierarchy": resume_trie.to_tree_hierarchy(max_depth=4),
        "time_complexity": "O(L) where L = word length"
    }
    stages.append(stage_4_data)

    # -------------------------------------------------------------
    # STAGE 5: STRING MATCHING & FUZZY (KMP + RABIN-KARP + EDIT DISTANCE)
    # -------------------------------------------------------------
    string_matching_results = []
    
    # Analyze each job requirement across exact, substring, and fuzzy matching
    matched_requirements_list = []

    # Prepare job requirements list
    job_req_items = []
    if job_requirements_override:
        job_req_items = job_requirements_override
    else:
        # Build requirements from job description detected skills
        for s in target_job_skills:
            job_req_items.append({
                "name": s,
                "category": SKILL_CATEGORIES.get(s, "General"),
                "weight": 10.0 if SKILL_CATEGORIES.get(s, "") in ["Languages", "Frameworks", "Cloud & DevOps"] else 8.0,
                "is_required": True
            })

    for req in job_req_items:
        skill_name = req["name"]
        norm_name = normalize_token(skill_name)
        weight = req.get("weight", 10.0)

        # 1. Exact HashMap Check
        resume_val = resume_hashmap.get(norm_name)
        if resume_val is not None and resume_val > 0:
            matched_requirements_list.append({
                "name": skill_name,
                "normalized_as": norm_name,
                "status": "MATCHED",
                "weight": weight,
                "matching_method": f"Exact HashMap match (Frequency: {resume_val})",
                "category": SKILL_CATEGORIES.get(norm_name, req.get("category", "General")),
                "algorithm": "HashMap O(1)"
            })
            continue

        # 2. Trie Search Check
        trie_res = resume_trie.search(norm_name)
        if trie_res["found"]:
            matched_requirements_list.append({
                "name": skill_name,
                "normalized_as": norm_name,
                "status": "MATCHED",
                "weight": weight,
                "matching_method": f"Trie Exact Path match ({' → '.join(trie_res['path'])})",
                "category": SKILL_CATEGORIES.get(norm_name, req.get("category", "General")),
                "algorithm": "Trie O(L)"
            })
            continue

        # 3. KMP and Rabin-Karp Substring Matching in raw resume text
        kmp_res = kmp_search(resume_text, skill_name)
        if kmp_res["matches"]:
            matched_requirements_list.append({
                "name": skill_name,
                "normalized_as": norm_name,
                "status": "MATCHED",
                "weight": weight,
                "matching_method": f"KMP Substring Match at index {kmp_res['matches'][0]}",
                "category": SKILL_CATEGORIES.get(norm_name, req.get("category", "General")),
                "algorithm": "KMP O(N+M)"
            })
            string_matching_results.append({
                "skill": skill_name,
                "method": "KMP",
                "matches_count": len(kmp_res["matches"]),
                "comparisons": kmp_res["total_comparisons"]
            })
            continue

        # Rabin-Karp fallback check
        rk_res = rabin_karp_search(resume_text, skill_name)
        if rk_res["matches"]:
            matched_requirements_list.append({
                "name": skill_name,
                "normalized_as": norm_name,
                "status": "MATCHED",
                "weight": weight,
                "matching_method": f"Rabin-Karp Rolling Hash Match at index {rk_res['matches'][0]}",
                "category": SKILL_CATEGORIES.get(norm_name, req.get("category", "General")),
                "algorithm": "Rabin-Karp O(N+M)"
            })
            string_matching_results.append({
                "skill": skill_name,
                "method": "Rabin-Karp",
                "matches_count": len(rk_res["matches"]),
                "collisions": rk_res["collisions_count"]
            })
            continue

        # 4. Levenshtein Edit Distance Check (Fuzzy match against all resume skills)
        best_fuzzy_match = None
        min_dist = 999
        for resume_skill in resume_norm["detected_skills"].keys():
            ed_res = compute_edit_distance(skill_name, resume_skill)
            if ed_res["edit_distance"] < min_dist:
                min_dist = ed_res["edit_distance"]
                best_fuzzy_match = (resume_skill, ed_res)

        # If edit distance is 1 or 2 (small typo / variant) -> PARTIAL match
        if best_fuzzy_match and min_dist <= 2 and len(skill_name) >= 4:
            matched_requirements_list.append({
                "name": skill_name,
                "normalized_as": best_fuzzy_match[0],
                "status": "PARTIAL",
                "weight": weight,
                "matching_method": f"Fuzzy Edit Distance ({min_dist} edits from '{best_fuzzy_match[0]}', {best_fuzzy_match[1]['similarity_percentage']}% similarity)",
                "category": SKILL_CATEGORIES.get(norm_name, req.get("category", "General")),
                "algorithm": "Edit Distance DP O(N×M)"
            })
            continue

        # 5. Missing Requirement
        matched_requirements_list.append({
            "name": skill_name,
            "normalized_as": norm_name,
            "status": "MISSING",
            "weight": weight,
            "matching_method": "No exact, normalized, substring, or fuzzy match found",
            "category": SKILL_CATEGORIES.get(norm_name, req.get("category", "General")),
            "algorithm": "Exhaustive Multi-Algorithm Check"
        })

    stage_5_data = {
        "stage_id": 5,
        "stage_name": "STRING MATCHING & FUZZY",
        "icon": "Search",
        "description": "Apply KMP, Rabin-Karp, and Dynamic Programming Edit Distance for substrings and typo tolerance.",
        "status": "COMPLETED",
        "string_matches": string_matching_results,
        "edit_distance_checks": [
            req for req in matched_requirements_list if "Edit Distance" in req["matching_method"]
        ][:5],
        "algorithms_applied": ["KMP O(n+m)", "Rabin-Karp O(n+m)", "Levenshtein DP O(n×m)"]
    }
    stages.append(stage_5_data)

    # -------------------------------------------------------------
    # STAGE 6: REQUIREMENT WEIGHTS & WEIGHTED RANKING
    # -------------------------------------------------------------
    ranking_result = calculate_weighted_match_score(matched_requirements_list, custom_weights)

    stage_6_data = {
        "stage_id": 6,
        "stage_name": "REQUIREMENT WEIGHTS",
        "icon": "Sliders",
        "description": "Weight job requirements using priority heap ranking and calculate proportional match points.",
        "status": "COMPLETED",
        "matched_weight": ranking_result["matched_weight"],
        "total_weight": ranking_result["total_weight"],
        "formula": ranking_result["formula_string"],
        "ranked_skills_preview": ranking_result["ranked_requirements"][:8],
        "category_breakdown": ranking_result["category_breakdown"]
    }
    stages.append(stage_6_data)

    # -------------------------------------------------------------
    # STAGE 7: MATCH SCORE & REPORT
    # -------------------------------------------------------------
    # Battle view data preparation
    resume_skills_set = set(resume_norm["detected_skills"].keys())
    job_skills_set = set(req["name"] for req in job_req_items)
    
    battle_view = []
    # Add all job requirements to battle view
    for req in matched_requirements_list:
        battle_view.append({
            "skill": req["name"],
            "category": req["category"],
            "resume_has": req["status"] in ["MATCHED", "PARTIAL"],
            "job_has": True,
            "status": req["status"],
            "weight": req["weight"],
            "contribution": req.get("contribution", req["weight"] if req["status"] == "MATCHED" else (req["weight"] * 0.5 if req["status"] == "PARTIAL" else 0)),
            "method": req["matching_method"]
        })

    # Add extra resume skills (NOT RELEVANT / BONUS)
    for extra_skill in resume_skills_set:
        if extra_skill not in job_skills_set and not any(r["name"].lower() == extra_skill.lower() for r in job_req_items):
            battle_view.append({
                "skill": extra_skill,
                "category": SKILL_CATEGORIES.get(extra_skill, "General"),
                "resume_has": True,
                "job_has": False,
                "status": "NOT_RELEVANT",
                "weight": 0.0,
                "contribution": 0.0,
                "method": "Extra skill present in resume (Not requested by job)"
            })

    # Technical Report & Metrics
    req_items_only = [r for r in matched_requirements_list if r.get("weight", 0) >= 10.0]
    pref_items_only = [r for r in matched_requirements_list if r.get("weight", 0) < 10.0]

    req_score = 0.0
    if req_items_only:
        req_mat = sum(r["weight"] for r in req_items_only if r["status"] == "MATCHED") + sum(r["weight"] * 0.5 for r in req_items_only if r["status"] == "PARTIAL")
        req_tot = sum(r["weight"] for r in req_items_only)
        req_score = round((req_mat / req_tot) * 100, 1) if req_tot > 0 else 0.0
    else:
        req_score = ranking_result["overall_score"]

    pref_score = 0.0
    if pref_items_only:
        pref_mat = sum(r["weight"] for r in pref_items_only if r["status"] == "MATCHED") + sum(r["weight"] * 0.5 for r in pref_items_only if r["status"] == "PARTIAL")
        pref_tot = sum(r["weight"] for r in pref_items_only)
        pref_score = round((pref_mat / pref_tot) * 100, 1) if pref_tot > 0 else 0.0
    else:
        pref_score = round(ranking_result["overall_score"] * 0.85, 1)

    elapsed_ms = round((time.perf_counter() - pipeline_start_time) * 1000, 2)

    stage_7_data = {
        "stage_id": 7,
        "stage_name": "MATCH SCORE",
        "icon": "Award",
        "description": "Aggregate algorithmic proofs and generate interactive visual score and battle view.",
        "status": "COMPLETED",
        "final_score": ranking_result["overall_score"],
        "required_skills_score": req_score,
        "preferred_skills_score": pref_score,
        "keyword_coverage": ranking_result["stats"]["coverage_percentage"],
        "matched_count": ranking_result["stats"]["matched_count"],
        "partial_count": ranking_result["stats"]["partial_count"],
        "missing_count": ranking_result["stats"]["missing_count"],
        "total_requirements": len(matched_requirements_list),
        "execution_time_ms": elapsed_ms
    }
    stages.append(stage_7_data)

    return {
        "overall_score": ranking_result["overall_score"],
        "matched_weight": ranking_result["matched_weight"],
        "total_weight": ranking_result["total_weight"],
        "formula_string": ranking_result["formula_string"],
        "stages": stages,
        "requirements_explanation": matched_requirements_list,
        "battle_view": battle_view,
        "ranking_result": ranking_result,
        "technical_report": {
            "overall_match": ranking_result["overall_score"],
            "required_skills_match": req_score,
            "preferred_skills_match": pref_score,
            "keyword_coverage": ranking_result["stats"]["coverage_percentage"],
            "matched_requirements_count": ranking_result["stats"]["matched_count"],
            "missing_requirements_count": ranking_result["stats"]["missing_count"],
            "partial_matches_count": ranking_result["stats"]["partial_count"],
            "algorithms_used": [
                {"name": "HashMap", "complexity": "O(1) average lookup", "purpose": "Frequency mapping & instant O(1) keyword indexing"},
                {"name": "Trie (Prefix Tree)", "complexity": "O(L)", "purpose": "Prefix exploration & sub-word traversal"},
                {"name": "Knuth-Morris-Pratt (KMP)", "complexity": "O(n + m)", "purpose": "Linear string matching with LPS jump tables"},
                {"name": "Rabin-Karp", "complexity": "O(n + m) expected", "purpose": "Rolling hash sliding window & collision detection"},
                {"name": "Edit Distance (Levenshtein)", "complexity": "O(n × m)", "purpose": "Dynamic programming fuzzy matching & typo tolerance"},
                {"name": "Weighted Ranking Heap", "complexity": "O(k log k)", "purpose": "Priority heap sorting & mathematical weight attribution"}
            ],
            "execution_time_ms": elapsed_ms
        }
    }
