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
        "sunday"
    ]

    for word in date_keywords:
        if word in text:
            due = word
            break

    # -------------------------
    # Remove Keywords from Title
    # -------------------------

    title = original

    remove_words = [
        "urgent",
        "asap",
        "whenever",
        "low priority"
    ]

    for word in remove_words:
        title = re.sub(word, "", title, flags=re.IGNORECASE)

    if due:
        title = re.sub(due, "", title, flags=re.IGNORECASE)

    title = title.strip()

    if title == "":
        title = "Untitled task"

    return {
        "title": title,
        "priority": priority,
        "due_date": due
    }