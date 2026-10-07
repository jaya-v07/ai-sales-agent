"""Deterministic, clearly-labelled demo research provider.

This data is fictional and exists only to demonstrate the product workflow.
"""
from models.schemas import DecisionMaker, Evidence, Prospect, Signal

DEMO_SOURCE = "District 02 curated demo dataset (not live research)"

COMPANIES = [
    {
        "id": "orbitstack_001", "company": "OrbitStack", "website": "https://orbitstack.demo",
        "industry": "Developer tooling SaaS", "location": "Bengaluru, India", "company_size": "120-180",
        "description": "A fictional platform for distributed engineering teams to manage internal developer portals.",
        "name": "Mira Iyer", "role": "VP Engineering", "score": (27, 17, 22, 13, 8),
        "signals": ["Hiring two backend engineers", "Recently expanded its platform engineering group"],
        "summary": "OrbitStack is a strong fit: its platform engineering expansion and active backend hiring point to a team likely focused on developer velocity.",
    },
    {
        "id": "ledgerlane_002", "company": "LedgerLane", "website": "https://ledgerlane.demo",
        "industry": "Fintech SaaS", "location": "Mumbai, India", "company_size": "80-130",
        "description": "A fictional financial-operations workspace for mid-market businesses.",
        "name": "Arjun Mehta", "role": "CTO", "score": (27, 18, 22, 14, 8),
        "signals": ["Hiring backend engineers for integrations", "Launching an enterprise automation module"],
        "summary": "LedgerLane's integration hiring and enterprise launch suggest meaningful pressure on engineering throughput and reliable delivery.",
    },
    {
        "id": "relaygrid_003", "company": "RelayGrid", "website": "https://relaygrid.demo",
        "industry": "Operations SaaS", "location": "Pune, India", "company_size": "200-280",
        "description": "A fictional workflow platform that coordinates field-service operations.",
        "name": "Nandita Rao", "role": "Head of Engineering", "score": (26, 18, 21, 13, 8),
        "signals": ["Building a new integrations team", "Publicly describing a migration to event-driven services"],
        "summary": "RelayGrid has a credible engineering-change signal: a growing integrations function alongside a service architecture migration.",
    },
    {
        "id": "clearpath_004", "company": "ClearPath", "website": "https://clearpath.demo",
        "industry": "Revenue intelligence SaaS", "location": "Delhi NCR, India", "company_size": "60-90",
        "description": "A fictional analytics product for revenue operations teams.",
        "name": "Dev Malhotra", "role": "CTO", "score": (27, 17, 20, 13, 7),
        "signals": ["Hiring a senior backend engineer", "Opened a second engineering hub"],
        "summary": "ClearPath is a promising smaller-team prospect with direct hiring evidence and an expanding engineering footprint.",
    },
    {
        "id": "northstar_005", "company": "Northstar Cloud", "website": "https://northstar.demo",
        "industry": "Cloud management SaaS", "location": "Hyderabad, India", "company_size": "300-420",
        "description": "A fictional cloud cost and governance platform for technology teams.",
        "name": "Sana Kapoor", "role": "VP Engineering", "score": (25, 19, 19, 14, 8),
        "signals": ["Scaling its infrastructure engineering group", "Announced an API platform refresh"],
        "summary": "Northstar Cloud's API refresh and infrastructure-team scale-up create a relevant, though less immediate, developer productivity opportunity.",
    },
]


def search_companies(intent):
    """Return stable demo candidates; a live provider can implement this contract later."""
    return COMPANIES


def research_company(company):
    return company


def find_decision_maker(company):
    return DecisionMaker(name=company["name"], role=company["role"], confidence=0.87)


def to_prospect(company, outreach):
    score = company["score"]
    signals = [
        Signal(text=text, source=DEMO_SOURCE, source_url=None, confidence=0.91 - index * 0.05)
        for index, text in enumerate(company["signals"])
    ]
    evidence = [
        Evidence(
            fact=company["signals"][0] + ".",
            inference="This may indicate engineering-team growth and a need to protect developer flow.",
            confidence="High",
            source=DEMO_SOURCE,
        ),
        Evidence(
            fact=company["signals"][1] + ".",
            inference="The company is likely navigating additional technical coordination or delivery complexity.",
            confidence="Medium",
            source=DEMO_SOURCE,
        ),
    ]
    from models.schemas import ScoreBreakdown
    return Prospect(
        **{key: company[key] for key in ("id", "company", "website", "industry", "location", "company_size", "description")},
        score=sum(score), score_breakdown=ScoreBreakdown(icp_fit=score[0], company_fit=score[1], buying_signals=score[2], decision_maker=score[3], evidence_quality=score[4]),
        buying_signals=signals, decision_maker=find_decision_maker(company), evidence=evidence,
        research_summary=company["summary"], outreach=outreach,
    )
