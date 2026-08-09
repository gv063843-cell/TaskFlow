from sorting_searching import (
    insertion_sort_count,
    binary_search_count,
    linear_search_count,
)


def generate_records(size):
    records = []

    for i in range(size):
        records.append({
            "id": size - i,
            "title": f"Task {size - i}",
            "priority": "medium",
            "due_date": None
        })

    return records


sizes = [10, 500, 3000]


for size in sizes:

    print("=" * 50)
    print(f"DATA SIZE: {size}")
    print("=" * 50)

    # -----------------------------
    # Insertion Sort
    # -----------------------------

    records = generate_records(size)

    insertion_comparisons = insertion_sort_count(
        records,
        "id"
    )

    print(
        "Insertion Sort comparisons:",
        insertion_comparisons
    )

    # -----------------------------
    # Binary Search
    # -----------------------------

    binary_result = binary_search_count(
        records,
        size // 2,
        "id"
    )

    print(
        "Binary Search:",
        binary_result
    )

    # -----------------------------
    # Linear Search
    # -----------------------------

    linear_records = generate_records(size)

    linear_result = linear_search_count(
        linear_records,
        size // 2,
        "id"
    )

    print(
        "Linear Search:",
        linear_result
    )

    print()