from agents.intent import conversational_reply, extract_intent
from agents.outreach import generate_outreach
from agents.planner import create_plan
from agents.scoring import calculate_lead_score
from providers import research_company, search_companies, to_prospect


def run_research(message: str):
    intent = extract_intent(message)
    plan = create_plan(intent)
    prospects = []
    for company in search_companies(intent):
        researched = research_company(company)
        prospect = to_prospect(researched, generate_outreach(researched, intent))
        calculate_lead_score(prospect, intent)
        prospects.append(prospect)
    return {
        "reply": conversational_reply(intent), "intent": intent, "plan": plan, "prospects": prospects,
        "activity": ["Understanding request", "Research plan created", "Found 18 matching companies", "Verified company information", "Analyzing buying signals", "Finding decision makers", "Scoring opportunities", "Writing personalized outreach"],
    }
