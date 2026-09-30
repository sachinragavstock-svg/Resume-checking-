"""
Custom Hash Map Implementation with Separate Chaining and Step-by-Step Visualization Tracing.
Average Time Complexity: O(1) Lookup, Insert, Delete
Space Complexity: O(N)
"""

from typing import Any, List, Optional, Tuple, Dict


class HashNode:
    def __init__(self, key: str, value: Any):
        self.key: str = key
        self.value: Any = value
        self.next: Optional['HashNode'] = None

    def to_dict(self) -> Dict[str, Any]:
        return {
            "key": self.key,
            "value": self.value,
            "has_next": self.next is not None
        }


class CustomHashMap:
    def __init__(self, initial_capacity: int = 16, load_factor_threshold: float = 0.75):
        self.capacity: int = initial_capacity
        self.size: int = 0
        self.load_factor_threshold: float = load_factor_threshold
        self.buckets: List[Optional[HashNode]] = [None] * self.capacity

    def _hash(self, key: str) -> int:
        """Custom polynomial rolling hash for educational clarity."""
        h = 0
        p = 31
        m = 10**9 + 9
        for char in key:
            h = (h * p + ord(char)) % m
        return h

    def _bucket_index(self, key: str) -> Tuple[int, int]:
        raw_hash = self._hash(key)
        index = raw_hash % self.capacity
        return raw_hash, index

    def put(self, key: str, value: Any) -> None:
        if (self.size + 1) / self.capacity > self.load_factor_threshold:
            self._resize(self.capacity * 2)

        _, index = self._bucket_index(key)
        head = self.buckets[index]

        # Check if key already exists
        curr = head
        while curr:
            if curr.key == key:
                curr.value = value
                return
            curr = curr.next

        # Insert new node at head of chain
        new_node = HashNode(key, value)
        new_node.next = head
        self.buckets[index] = new_node
        self.size += 1

    def increment(self, key: str, delta: int = 1) -> int:
        """Increments integer frequency count for a key."""
        if (self.size + 1) / self.capacity > self.load_factor_threshold:
            self._resize(self.capacity * 2)

        _, index = self._bucket_index(key)
        curr = self.buckets[index]
        while curr:
            if curr.key == key:
                curr.value = int(curr.value) + delta
                return curr.value
            curr = curr.next

        new_node = HashNode(key, delta)
        new_node.next = self.buckets[index]
        self.buckets[index] = new_node
        self.size += 1
        return delta

    def get(self, key: str) -> Optional[Any]:
        _, index = self._bucket_index(key)
        curr = self.buckets[index]
        while curr:
            if curr.key == key:
                return curr.value
            curr = curr.next
        return None

    def contains(self, key: str) -> bool:
        return self.get(key) is not None

    def _resize(self, new_capacity: int) -> None:
        old_buckets = self.buckets
        self.capacity = new_capacity
        self.buckets = [None] * self.capacity
        self.size = 0

        for head in old_buckets:
            curr = head
            while curr:
                self.put(curr.key, curr.value)
                curr = curr.next

    def to_dict(self) -> Dict[str, Any]:
        result = {}
        for head in self.buckets:
            curr = head
            while curr:
                result[curr.key] = curr.value
                curr = curr.next
        return result

    def get_structure_view(self) -> List[Dict[str, Any]]:
        """Returns visual bucket representation for frontend visualizer."""
        table = []
        for idx in range(self.capacity):
            chain = []
            curr = self.buckets[idx]
            while curr:
                chain.append({"key": curr.key, "value": curr.value})
                curr = curr.next
            table.append({
                "bucket_index": idx,
                "chain_length": len(chain),
                "nodes": chain
            })
        return table

    def trace_lookup(self, key: str) -> Dict[str, Any]:
        """Traces the exact steps taken during a lookup for the interactive lab."""
        raw_hash, bucket_idx = self._bucket_index(key)
        steps = [
            {
                "step": 1,
                "stage": "INPUT",
                "message": f"Received search key: '{key}'",
                "data": {"key": key}
            },
            {
                "step": 2,
                "stage": "HASH_COMPUTATION",
                "message": f"Computed polynomial hash code: {raw_hash}",
                "data": {"raw_hash": raw_hash}
            },
            {
                "step": 3,
                "stage": "BUCKET_MAPPING",
                "message": f"Mapped to bucket index: {raw_hash} % {self.capacity} = {bucket_idx}",
                "data": {"bucket_index": bucket_idx, "capacity": self.capacity}
            }
        ]

        curr = self.buckets[bucket_idx]
        chain_pos = 0
        found = False
        found_val = None

        while curr:
            is_match = (curr.key == key)
            steps.append({
                "step": 4 + chain_pos,
                "stage": "CHAIN_TRAVERSAL",
                "message": f"Comparing with node {chain_pos} in Bucket {bucket_idx}: '{curr.key}' == '{key}' -> {'MATCH' if is_match else 'NO MATCH'}",
                "data": {"node_index": chain_pos, "node_key": curr.key, "node_value": curr.value, "match": is_match}
            })
            if is_match:
                found = True
                found_val = curr.value
                break
            curr = curr.next
            chain_pos += 1

        steps.append({
            "step": len(steps) + 1,
            "stage": "RESULT",
            "message": f"Final lookup result for '{key}': {'Value = ' + str(found_val) if found else 'KEY NOT FOUND'}",
            "data": {"found": found, "value": found_val, "time_complexity": "O(1) average"}
        })

        return {
            "key": key,
            "raw_hash": raw_hash,
            "bucket_index": bucket_idx,
            "found": found,
            "value": found_val,
            "steps": steps,
            "complexity": {
                "time_average": "O(1)",
                "time_worst": "O(N)",
                "space": "O(N)"
            }
        }
