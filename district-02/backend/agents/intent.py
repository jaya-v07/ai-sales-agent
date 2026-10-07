from models.schemas import Intent


def extract_intent(message: str) -> Intent:
    text = message.lower()
    product = "developer productivity platform"
    if "sell" in text:
        product = message.split("sell", 1)[-1].strip(" .") or product
    geography = ["India"] if "india" in text or "indian" in text else ["India"]
    return Intent(product=product, geography=geography)


def conversational_reply(intent: Intent) -> str:
    return f"Got it. I’ll prioritize {intent.geography[0]} SaaS companies in the {intent.company_size} employee range and look for active engineering hiring signals."
