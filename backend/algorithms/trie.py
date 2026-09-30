"""
Trie (Prefix Tree) Implementation with Step-by-Step Traversal Tracing and Tree Exporter.
Search Time Complexity: O(L) where L is length of key.
Space Complexity: O(Alphabet_Size * L * N)
"""

from typing import Dict, Any, List, Optional, Tuple


class TrieNode:
    _id_counter = 0

    def __init__(self, char: str = "", is_end: bool = False, value: Any = None):
        TrieNode._id_counter += 1
        self.node_id: int = TrieNode._id_counter
        self.char: str = char
        self.is_end_of_word: bool = is_end
        self.value: Any = value
        self.frequency: int = 0
        self.children: Dict[str, 'TrieNode'] = {}

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.node_id,
            "char": self.char if self.char else "ROOT",
            "is_end": self.is_end_of_word,
            "frequency": self.frequency,
            "children_count": len(self.children)
        }


class CustomTrie:
    def __init__(self):
        TrieNode._id_counter = 0
        self.root: TrieNode = TrieNode("ROOT")
        self.word_count: int = 0

    def insert(self, word: str, value: Any = None) -> List[Dict[str, Any]]:
        """Inserts a word into the Trie and returns the step-by-step insertion trace."""
        word_clean = word.strip().lower()
        curr = self.root
        steps = []

        steps.append({
            "step": 1,
            "char": "ROOT",
            "node_id": curr.node_id,
            "action": "START_AT_ROOT",
            "message": f"Starting insertion of '{word}' at ROOT"
        })

        for idx, char in enumerate(word_clean):
            created_new = False
            if char not in curr.children:
                curr.children[char] = TrieNode(char)
                created_new = True
            curr = curr.children[char]
            steps.append({
                "step": idx + 2,
                "char": char,
                "char_index": idx,
                "node_id": curr.node_id,
                "action": "CREATED_NODE" if created_new else "EXISTING_NODE",
                "message": f"Step {idx+1}: {'Created new node' if created_new else 'Navigated existing node'} for '{char}'"
            })

        if not curr.is_end_of_word:
            self.word_count += 1
        curr.is_end_of_word = True
        curr.frequency += 1
        if value is not None:
            curr.value = value

        steps.append({
            "step": len(steps) + 1,
            "char": word_clean[-1] if word_clean else "",
            "node_id": curr.node_id,
            "action": "MARKED_END",
            "message": f"Marked node as END_OF_WORD (Frequency: {curr.frequency})"
        })

        return steps

    def search(self, word: str) -> Dict[str, Any]:
        """Searches for an exact word in the Trie and returns the full step trace."""
        word_clean = word.strip().lower()
        curr = self.root
        path = ["ROOT"]
        node_ids = [curr.node_id]
        steps = []

        steps.append({
            "step": 1,
            "char": "ROOT",
            "node_id": curr.node_id,
            "found": True,
            "message": f"Starting search for '{word}' at ROOT"
        })

        for idx, char in enumerate(word_clean):
            if char not in curr.children:
                steps.append({
                    "step": idx + 2,
                    "char": char,
                    "node_id": None,
                    "found": False,
                    "message": f"Character '{char}' NOT found in current node's children. Search terminated."
                })
                return {
                    "word": word,
                    "found": False,
                    "matched_length": idx,
                    "total_length": len(word_clean),
                    "path": path,
                    "node_ids": node_ids,
                    "steps": steps,
                    "time_complexity": f"O(L) = O({len(word_clean)})",
                    "explanation": f"Mismatch at character '{char}' (index {idx})."
                }

            curr = curr.children[char]
            path.append(char.upper())
            node_ids.append(curr.node_id)
            steps.append({
                "step": idx + 2,
                "char": char,
                "node_id": curr.node_id,
                "found": True,
                "is_end": curr.is_end_of_word,
                "message": f"Found character '{char}' -> Node ID {curr.node_id} (End of word: {curr.is_end_of_word})"
            })

        is_exact_match = curr.is_end_of_word
        steps.append({
            "step": len(steps) + 1,
            "char": word_clean[-1] if word_clean else "",
            "node_id": curr.node_id,
            "found": is_exact_match,
            "is_end": is_exact_match,
            "message": f"Path complete: {'Exact match confirmed ✓' if is_exact_match else 'Prefix exists, but is NOT marked as end of word ✕'}"
        })

        return {
            "word": word,
            "found": is_exact_match,
            "is_prefix_only": (not is_exact_match),
            "frequency": curr.frequency if is_exact_match else 0,
            "matched_length": len(word_clean),
            "total_length": len(word_clean),
            "path": path,
            "node_ids": node_ids,
            "steps": steps,
            "time_complexity": f"O(L) = O({len(word_clean)}) operations",
            "explanation": f"Traversed {len(word_clean)} nodes in O(L) time."
        }

    def starts_with(self, prefix: str) -> Dict[str, Any]:
        """Checks if any word in the Trie starts with the given prefix."""
        prefix_clean = prefix.strip().lower()
        curr = self.root
        path = ["ROOT"]
        node_ids = [curr.node_id]

        for char in prefix_clean:
            if char not in curr.children:
                return {
                    "prefix": prefix,
                    "exists": False,
                    "path": path,
                    "node_ids": node_ids,
                    "suggestions": []
                }
            curr = curr.children[char]
            path.append(char.upper())
            node_ids.append(curr.node_id)

        suggestions = self._collect_words(curr, prefix_clean, limit=10)
        return {
            "prefix": prefix,
            "exists": True,
            "path": path,
            "node_ids": node_ids,
            "suggestions": suggestions,
            "time_complexity": f"O(L) = O({len(prefix_clean)})"
        }

    def autocomplete(self, prefix: str, limit: int = 8) -> List[str]:
        prefix_clean = prefix.strip().lower()
        curr = self.root
        for char in prefix_clean:
            if char not in curr.children:
                return []
            curr = curr.children[char]
        return self._collect_words(curr, prefix_clean, limit=limit)

    def _collect_words(self, node: TrieNode, prefix: str, limit: int) -> List[str]:
        results = []
        if node.is_end_of_word:
            results.append(prefix)

        for char, child_node in sorted(node.children.items()):
            if len(results) >= limit:
                break
            results.extend(self._collect_words(child_node, prefix + char, limit - len(results)))
        return results

    def to_tree_hierarchy(self, max_depth: int = 6) -> Dict[str, Any]:
        """Serializes the Trie into hierarchical node/children format for D3 / SVG rendering."""
        def _serialize_node(node: TrieNode, depth: int) -> Dict[str, Any]:
            children_list = []
            if depth < max_depth:
                for char, child in sorted(node.children.items()):
                    children_list.append(_serialize_node(child, depth + 1))
            return {
                "id": node.node_id,
                "name": node.char.upper() if node.char else "ROOT",
                "is_end": node.is_end_of_word,
                "frequency": node.frequency,
                "children": children_list
            }

        return _serialize_node(self.root, 0)
