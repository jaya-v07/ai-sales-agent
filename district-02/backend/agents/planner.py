def create_plan(intent):
    return [
        f"Find {intent.geography[0]} SaaS companies matching the target size",
        "Verify company industry, size, and location",
        "Look for active engineering hiring and growth signals",
        "Identify technical decision-makers",
        "Collect clearly-labelled evidence",
        "Score opportunities and draft personalized outreach",
    ]
