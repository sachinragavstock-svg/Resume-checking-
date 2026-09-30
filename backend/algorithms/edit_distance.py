"""
Dynamic Programming Edit Distance (Levenshtein Distance) Implementation.
Provides full DP Matrix state, cell calculation steps, and optimal alignment backtrace.
Time Complexity: O(N * M)
Space Complexity: O(N * M)
"""

from typing import List, Dict, Any, Tuple


def compute_edit_distance(word1: str, word2: str) -> Dict[str, Any]:
    """
    Computes Levenshtein edit distance between word1 and word2.
    Generates the entire DP matrix, step-by-step cell computations, and optimal operation alignment.
    """
    w1 = word1.strip()
    w2 = word2.strip()
    m = len(w1)
    n = len(w2)

    # Initialize (m+1) x (n+1) DP matrix
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    calculation_steps = []

    # Row 0 labels and Col 0 labels
    row_headers = ["ε"] + list(w1)
    col_headers = ["ε"] + list(w2)

    # Base case initialization
    for i in range(m + 1):
        dp[i][0] = i
    for j in range(n + 1):
        dp[0][j] = j

    calculation_steps.append({
        "step": 1,
        "action": "BASE_INIT",
        "row": 0,
        "col": 0,
        "message": f"Initialized base rows and columns for empty prefix 'ε'. Base costs represent pure inserts/deletions.",
        "matrix_snapshot": [row[:] for row in dp]
    })

    # Fill DP table
    step_num = 2
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            c1 = w1[i - 1]
            c2 = w2[j - 1]

            if c1.lower() == c2.lower():
                cost = dp[i - 1][j - 1]
                op_type = "MATCH"
                formula = f"Chars match ('{c1}' == '{c2}'): DP[{i}][{j}] = DP[{i-1}][{j-1}] = {cost}"
            else:
                del_cost = dp[i - 1][j] + 1
                ins_cost = dp[i][j - 1] + 1
                sub_cost = dp[i - 1][j - 1] + 1
                cost = min(del_cost, ins_cost, sub_cost)
                if cost == sub_cost:
                    op_type = "SUBSTITUTE"
                    formula = f"Substitute '{c1}' with '{c2}': 1 + DP[{i-1}][{j-1}] ({dp[i-1][j-1]}) = {cost}"
                elif cost == ins_cost:
                    op_type = "INSERT"
                    formula = f"Insert '{c2}': 1 + DP[{i}][{j-1}] ({dp[i][j-1]}) = {cost}"
                else:
                    op_type = "DELETE"
                    formula = f"Delete '{c1}': 1 + DP[{i-1}][{j}] ({dp[i-1][j]}) = {cost}"

            dp[i][j] = cost

            calculation_steps.append({
                "step": step_num,
                "action": "COMPUTE_CELL",
                "row": i,
                "col": j,
                "char1": c1,
                "char2": c2,
                "op_type": op_type,
                "value": cost,
                "formula": formula,
                "message": f"DP[{i}][{j}] for ('{c1}', '{c2}') -> {op_type} => Value = {cost}"
            })
            step_num += 1

    # Backtrace path for alignment
    backtrace_path = []
    operations = []
    curr_i = m
    curr_j = n

    while curr_i > 0 or curr_j > 0:
        backtrace_path.append({"row": curr_i, "col": curr_j, "value": dp[curr_i][curr_j]})
        if curr_i > 0 and curr_j > 0 and w1[curr_i - 1].lower() == w2[curr_j - 1].lower():
            operations.append({
                "operation": "MATCH",
                "char1": w1[curr_i - 1],
                "char2": w2[curr_j - 1],
                "cost": 0,
                "desc": f"Keep '{w1[curr_i - 1]}'"
            })
            curr_i -= 1
            curr_j -= 1
        elif curr_i > 0 and curr_j > 0 and dp[curr_i][curr_j] == dp[curr_i - 1][curr_j - 1] + 1:
            operations.append({
                "operation": "SUBSTITUTE",
                "char1": w1[curr_i - 1],
                "char2": w2[curr_j - 1],
                "cost": 1,
                "desc": f"Replace '{w1[curr_i - 1]}' with '{w2[curr_j - 1]}'"
            })
            curr_i -= 1
            curr_j -= 1
        elif curr_j > 0 and dp[curr_i][curr_j] == dp[curr_i][curr_j - 1] + 1:
            operations.append({
                "operation": "INSERT",
                "char1": "-",
                "char2": w2[curr_j - 1],
                "cost": 1,
                "desc": f"Insert '{w2[curr_j - 1]}'"
            })
            curr_j -= 1
        elif curr_i > 0 and dp[curr_i][curr_j] == dp[curr_i - 1][curr_j] + 1:
            operations.append({
                "operation": "DELETE",
                "char1": w1[curr_i - 1],
                "char2": "-",
                "cost": 1,
                "desc": f"Delete '{w1[curr_i - 1]}'"
            })
            curr_i -= 1
        else:
            if curr_i > 0:
                curr_i -= 1
            if curr_j > 0:
                curr_j -= 1

    backtrace_path.append({"row": 0, "col": 0, "value": dp[0][0]})
    backtrace_path.reverse()
    operations.reverse()

    distance = dp[m][n]
    max_len = max(m, n, 1)
    similarity = max(0.0, round((1.0 - (distance / max_len)) * 100, 1))

    return {
        "word1": w1,
        "word2": w2,
        "row_headers": row_headers,
        "col_headers": col_headers,
        "matrix": dp,
        "edit_distance": distance,
        "similarity_percentage": similarity,
        "calculation_steps": calculation_steps,
        "backtrace_path": backtrace_path,
        "alignment_operations": operations,
        "time_complexity": f"O(N × M) = O({m} × {n}) = {m * n} cell updates",
        "space_complexity": f"O(N × M) = O({m+1} × {n+1}) cells",
        "explanation": f"Transforming '{w1}' to '{w2}' requires {distance} minimum edits (Similarity: {similarity}%)."
    }
