import re

SYSTEM_PROMPT = """
You are TaskFlow's task parsing assistant.
Convert the user's task description into a structured task with:

- title
- priority
- due_date

Priority must be low, medium, or high.
Extract recognized due-date phrases exactly as specified.
Do not invent information.
""".strip()


def build_prompt(description: str):
    return [
        {
            "role": "system",
            "content": SYSTEM_PROMPT
        },
        {
            "role": "user",
            "content": description
        }
    ]


def mock_ai_parser(description: str):
    original = description
    text = description.lower()

    # Priority
    if "urgent" in text or "asap" in text or "high priority" in text:
        priority = "high"
    elif "whenever" in text or "low priority" in text:
        priority = "low"
    else:
        priority = "medium"

    # Due date
    due_date = None

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
            due_date = word
            break

    # Remove priority words
    title = original

    remove_words = [
        "urgent",
        "asap",
        "whenever",
        "low priority",
        "high priority",
    ]

    for word in remove_words:
        title = re.sub(
            re.escape(word),
            "",
            title,
            flags=re.IGNORECASE
        )

    # Remove due date
    if due_date:
        title = re.sub(
            re.escape(due_date),
            "",
            title,
            flags=re.IGNORECASE
        )

    # Clean title
    title = re.sub(r"\s+", " ", title).strip()
    title = title.strip(" ,.-")

    if not title:
        title = "Untitled task"

    return {
        "title": title,
        "priority": priority,
        "due_date": due_date
    }