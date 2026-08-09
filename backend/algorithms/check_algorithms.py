from sorting_searching import (
    insertion_sort_count,
    binary_search_count,
    linear_search_count
)


records = [
    {"id": 5, "name": "E"},
    {"id": 2, "name": "B"},
    {"id": 8, "name": "H"},
    {"id": 1, "name": "A"},
    {"id": 6, "name": "F"},
]


# -----------------------------
# Insertion Sort Benchmark
# -----------------------------

sort_records = records.copy()

sort_comparisons = insertion_sort_count(
    sort_records,
    "id"
)

print("Sorted Records:")
print(sort_records)

print("Insertion Sort Comparisons:", sort_comparisons)


# -----------------------------
# Binary Search Benchmark
# -----------------------------

binary_result = binary_search_count(
    sort_records,
    6,
    "id"
)

print("Binary Search Result:")
print(binary_result)


# -----------------------------
# Linear Search Benchmark
# -----------------------------

linear_result = linear_search_count(
    records,
    6,
    "id"
)

print("Linear Search Result:")
print(linear_result)