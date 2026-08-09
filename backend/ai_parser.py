import re


def mock_ai_parser(description: str):
    original = description
    text = description.lower()

    # -------------------------
    # Priority
    # -------------------------
    if "urgent" in text or "asap" in text:
        priority = "high"
    elif "whenever" in text or "low priority" in text:
        priority = "low"
    else:
        priority = "medium"

    # -------------------------
    # Due Date
    # Exact order required
    # -------------------------
    due = None

    date_keywords = [
        "today",
        "tomorrow",
        "next week",
        "next monday",
        "next tuesday",
        "next wednesday",
        "next thursday",
        "next friday",
        "next saturday",
        "next sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
    ]

    for word in date_keywords:
        if word in text:
            due = word
            break

    # -------------------------
    # Remove priority keywords
    # Remove EVERY occurrence
    # -------------------------
    title = original

    remove_words = [
        "urgent",
        "asap",
        "whenever",
        "low priority",
    ]

    for word in remove_words:
        title = re.sub(
            re.escape(word),
            "",
            title,
            flags=re.IGNORECASE
        )

    # -------------------------
    # Remove EVERY occurrence
    # of matched due-date phrase
    # -------------------------
    if due:
        title = re.sub(
            re.escape(due),
            "",
            title,
            flags=re.IGNORECASE
        )

    # -------------------------
    # Clean title
    # -------------------------
    title = title.strip()

    if not title:
        title = "Untitled task"

    return {
        "title": title,
        "priority": priority,
        "due_date": due
    }