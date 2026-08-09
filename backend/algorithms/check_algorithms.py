from sorting_searching import (
    insertion_sort,
    binary_search,
    insertion_sort_count,
    binary_search_count,
    linear_search_count,
)


def check(case_name, result, expected):
    if result == expected:
        print(f"PASS: {case_name}")
    else:
        print(f"FAIL: {case_name} — expected {expected}, got {result}")


# ==========================================
# 1. insertion_sort - empty list
# ==========================================

records = []

try:
    insertion_sort(records, "id")
    check(
        "insertion_sort empty list",
        records,
        []
    )
except Exception as e:
    print(f"FAIL: insertion_sort empty list — {e}")


# ==========================================
# 2. insertion_sort - single element
# ==========================================

records = [{"id": 5}]

try:
    insertion_sort(records, "id")
    check(
        "insertion_sort single element",
        records,
        [{"id": 5}]
    )
except Exception as e:
    print(f"FAIL: insertion_sort single element — {e}")


# ==========================================
# 3. Binary search - first index
# ==========================================

records = [
    {"id": 1},
    {"id": 2},
    {"id": 3},
    {"id": 4},
    {"id": 5},
]

result = binary_search(records, 1, "id")
check("binary_search first index", result, 0)


# ==========================================
# 4. Binary search - middle index
# ==========================================

result = binary_search(records, 3, "id")
check("binary_search middle index", result, 2)


# ==========================================
# 5. Binary search - last index
# ==========================================

result = binary_search(records, 5, "id")
check("binary_search last index", result, 4)


# ==========================================
# 6. Binary search - not found
# ==========================================

result = binary_search(records, 10, "id")
check("binary_search not found", result, -1)


# ==========================================
# 7. insertion_sort_count
# ==========================================

records = [
    {"id": 5},
    {"id": 2},
    {"id": 8},
    {"id": 1},
    {"id": 6},
]

count = insertion_sort_count(records, "id")

expected_sorted = [
    {"id": 1},
    {"id": 2},
    {"id": 5},
    {"id": 6},
    {"id": 8},
]

check(
    "insertion_sort_count sorted result",
    records,
    expected_sorted
)

if type(count) == int and count > 0:
    print("PASS: insertion_sort_count comparison count")
else:
    print(
        f"FAIL: insertion_sort_count comparison count "
        f"— expected positive int, got {count}"
    )


# ==========================================
# 8. binary_search_count
# ==========================================

records = [
    {"id": 1},
    {"id": 2},
    {"id": 3},
    {"id": 4},
    {"id": 5},
]

result = binary_search_count(records, 4, "id")

if (
    result["index"] == 3
    and type(result["comparison_count"]) == int
    and result["comparison_count"] > 0
):
    print("PASS: binary_search_count")
else:
    print(
        f"FAIL: binary_search_count — "
        f"expected index 3 and positive int comparison count, got {result}"
    )


# ==========================================
# 9. linear_search_count - absent value
# ==========================================

records = [
    {"id": 1},
    {"id": 2},
    {"id": 3},
    {"id": 4},
    {"id": 5},
]

result = linear_search_count(records, 99, "id")

expected = {
    "index": -1,
    "comparison_count": len(records)
}

check(
    "linear_search_count absent value",
    result,
    expected
)


print("\nAlgorithm checks completed.")