"""
Requirement Weighting, Priority Heap Ranking, and Score Calculation Engine.
Complexity: O(K log K) where K is the number of job requirements.
"""

from typing import List, Dict, Any, Tuple
import heapq


def calculate_weighted_match_score(
    requirements: List[Dict[str, Any]],
    custom_weights: Dict[str, float] = None
) -> Dict[str, Any]:
    """
    Calculates weighted match score and provides exact step-by-step mathematical explanation.
    
    Formula:
      Score = (Matched Weight / Total Weight) * 100
    
    Each requirement has:
      - name: str
      - status: 'MATCHED' (factor 1.0), 'PARTIAL' (factor 0.5), 'MISSING' (factor 0.0)
      - default_weight: float (e.g. 10 for core, 5 for preferred)
      - category: str (e.g. 'Languages', 'Cloud', 'Frameworks')
      - matching_method: str ('Exact HashMap match', 'Alias normalization', 'Trie prefix', etc.)
    """
    if not requirements:
        return {
            "overall_score": 0.0,
            "matched_weight": 0.0,
            "total_weight": 0.0,
            "formula_string": "0 / 0 * 100 = 0%",
            "ranked_requirements": [],
            "category_breakdown": {},
            "stats": {
                "matched_count": 0,
                "partial_count": 0,
                "missing_count": 0,
                "total_count": 0
            }
        }

    total_weight = 0.0
    matched_weight = 0.0
    processed_items = []
    category_map = {}

    matched_count = 0
    partial_count = 0
    missing_count = 0

    # Max-Heap for ranking requirements by importance/weight
    heap = []

    for req in requirements:
        name = req.get("name", "Unknown")
        status = req.get("status", "MISSING").upper()
        category = req.get("category", "General")
        
        # Override weight if custom weight provided
        weight = float(custom_weights.get(name, req.get("weight", 10.0))) if custom_weights else float(req.get("weight", 10.0))
        matching_method = req.get("matching_method", "No match found")
        normalized_as = req.get("normalized_as", name)

        if status == "MATCHED":
            factor = 1.0
            matched_count += 1
        elif status == "PARTIAL":
            factor = 0.5
            partial_count += 1
        else:
            factor = 0.0
            missing_count += 1

        contribution = weight * factor
        total_weight += weight
        matched_weight += contribution

        item = {
            "name": name,
            "status": status,
            "weight": weight,
            "factor": factor,
            "contribution": contribution,
            "category": category,
            "matching_method": matching_method,
            "normalized_as": normalized_as,
            "details": req.get("details", "")
        }
        processed_items.append(item)

        # In Python heapq is a min-heap; push (-weight, name) to simulate max-heap
        heapq.heappush(heap, (-weight, name, item))

        if category not in category_map:
            category_map[category] = {"total_weight": 0.0, "matched_weight": 0.0, "skills": []}
        category_map[category]["total_weight"] += weight
        category_map[category]["matched_weight"] += contribution
        category_map[category]["skills"].append(item)

    # Pop from heap to produce ranked list by weight (O(K log K))
    ranked_list = []
    rank = 1
    while heap:
        neg_w, item_name, item_dict = heapq.heappop(heap)
        ranked_list.append({
            "rank": rank,
            **item_dict
        })
        rank += 1

    overall_score = round((matched_weight / total_weight) * 100, 1) if total_weight > 0 else 0.0
    formula_string = f"{matched_weight:.1f} / {total_weight:.1f} × 100 = {overall_score:.1f}%"

    # Category summaries
    category_summary = {}
    for cat_name, cat_data in category_map.items():
        c_tot = cat_data["total_weight"]
        c_mat = cat_data["matched_weight"]
        c_score = round((c_mat / c_tot) * 100, 1) if c_tot > 0 else 0.0
        category_summary[cat_name] = {
            "score": c_score,
            "matched_weight": c_mat,
            "total_weight": c_tot,
            "skills_count": len(cat_data["skills"])
        }

    return {
        "overall_score": overall_score,
        "matched_weight": round(matched_weight, 1),
        "total_weight": round(total_weight, 1),
        "formula_string": formula_string,
        "ranked_requirements": ranked_list,
        "category_breakdown": category_summary,
        "stats": {
            "matched_count": matched_count,
            "partial_count": partial_count,
            "missing_count": missing_count,
            "total_count": len(requirements),
            "coverage_percentage": round((matched_count + 0.5 * partial_count) / max(1, len(requirements)) * 100, 1)
        },
        "complexity": {
            "time": "O(K log K) with Min/Max Priority Heap",
            "space": "O(K)"
        }
    }
