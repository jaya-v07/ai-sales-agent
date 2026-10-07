# District 02 — Product & Engineering Skills Specification

## 0. Product Definition

District 02 is an AI-powered B2B sales research and lead-generation workspace.

Core thesis:

> Sales research should feel like talking to an expert, not configuring a database.

Primary experience:

> Tell us who you want to sell to. We'll figure out who you should talk to.

The user describes a sales goal in natural language. The system interprets it, creates a research plan, discovers and researches companies, identifies relevant decision-makers, gathers evidence, scores opportunities, and drafts personalized 3-step outreach.

The human remains in control of outreach.

This is a hackathon MVP, not a production CRM.

## 1. Constraints

Optimize for:
- Fast local setup
- Beautiful polished UX
- Clear agentic workflow
- Deterministic demo behavior
- Modular architecture
- Easy replacement of demo providers with real providers
- No unnecessary infrastructure

Do NOT build yet:
- Authentication
- PostgreSQL
- Redis
- Docker/Kubernetes
- CRM integrations
- Automatic email sending
- Browser automation
- LinkedIn/X scraping
- Complex job queues
- Billing
- Enterprise permissions

Demo mode must work without API keys.

## 2. Technology

### Frontend
- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui where useful
- Lucide icons
- Framer Motion for restrained animation

### Backend
- Python
- FastAPI
- Pydantic

Architecture:

```text
Next.js Frontend
       ↓
FastAPI API
       ↓
Agent Orchestration
       ↓
Specialized Agents
       ↓
Research / Evidence / Scoring / Outreach
```

## 3. UX Philosophy

The application should feel like a modern AI-native SaaS product.

It should NOT look like:
- A Streamlit app
- A generic admin dashboard
- A spreadsheet
- A CRM clone
- A collection of forms

Prioritize:
- Visual hierarchy
- Whitespace
- Strong cards
- Subtle gradients
- Useful motion
- Interactive states
- Evidence visibility
- Conversational UX
- Clear calls to action

Hide implementation complexity behind the experience.

## 4. Core Workflow

```text
Natural Language Request
        ↓
Intent Understanding
        ↓
Clarification if Necessary
        ↓
Research Planning
        ↓
Company Discovery
        ↓
Company Verification
        ↓
Company Research
        ↓
Buying-Signal Research
        ↓
Decision-Maker Discovery
        ↓
Evidence Collection
        ↓
Explainable Lead Scoring
        ↓
Personalized 3-Step Outreach
        ↓
Human Review
        ↓
Approve
        ↓
Ready-to-Send Queue
```

## 5. Agent Architecture

Use specialized logical agents/functions rather than one giant prompt.

```text
Conversation Agent
        ↓
Clarification / Intent Agent
        ↓
Planner Agent
        ↓
Company Discovery Agent
        ↓
Company Verification Agent
        ↓
Signal Research Agent
        ↓
Decision-Maker Agent
        ↓
Evidence Agent
        ↓
Scoring Agent
        ↓
Outreach Agent
```

For the MVP these can be lightweight Python modules/functions. Do not over-engineer orchestration.

## 6. Intent Extraction

Example request:

> Find Indian SaaS companies with 50–500 employees that are hiring backend engineers. We're selling a developer productivity platform.

Extract approximately:

```python
{
    "product": "developer productivity platform",
    "target_market": "B2B SaaS",
    "industry": ["SaaS"],
    "company_size": "50-500",
    "geography": ["India"],
    "decision_maker": ["CTO", "VP Engineering", "Head of Engineering"],
    "buying_signals": [
        "backend engineering hiring",
        "engineering team growth"
    ],
    "outreach_style": "professional"
}
```

Do not force users to fill a form.

## 7. Clarification

Only ask follow-up questions when genuinely necessary.

Make reasonable assumptions and state them instead of asking many configuration questions.

## 8. Planner

Convert structured intent into a research plan, for example:

```python
[
    "Find Indian SaaS companies matching target size",
    "Verify company industry and location",
    "Look for active engineering hiring",
    "Identify technical decision-makers",
    "Collect public evidence",
    "Score prospects",
    "Generate personalized outreach"
]
```

The plan should be visible in the research activity UI.

## 9. Research

Support logical functions:

```python
def search_companies(intent): ...
def research_company(company): ...
def find_decision_maker(company): ...
def calculate_lead_score(prospect, intent): ...
def generate_outreach(prospect, intent): ...
```

Demo implementations should satisfy the same contracts as future live implementations.

Do not scrape LinkedIn or social networks.

Verify:
- Company name
- Website
- Industry
- Location
- Approximate size
- Description
- Relevant business context
- Buying signals

If something cannot be verified, mark it unknown rather than inventing it.

## 10. Buying Signals

Examples:
- Relevant hiring
- Engineering-team growth
- Product launch
- Market expansion
- Funding
- Technology migration
- Rapid growth
- Publicly stated operational challenge

Signal shape:

```python
{
    "text": "Hiring backend engineers",
    "source": "Public careers page",
    "source_url": "...",
    "confidence": 0.91
}
```

Never invent signals.

## 11. Decision Makers

Choose roles based on the product, such as CTO, VP Engineering, CISO, CFO, COO, Head of Sales.

Shape:

```python
{
    "name": "Jane Doe",
    "role": "CTO",
    "linkedin": "...",
    "email": "...",
    "confidence": 0.87
}
```

Never fabricate contact details. If an email is not publicly verified:

`Email: Not publicly verified`

Do not guess email formats.

## 12. Evidence Layer

Important claims should distinguish:

```text
FACT
INFERENCE
CONFIDENCE
SOURCE
```

Example:

```text
FACT
Company is hiring backend engineers.

SOURCE
Public careers page.

INFERENCE
This may indicate engineering-team expansion.

CONFIDENCE
High
```

This distinction is a core trust feature.

## 13. Lead Scoring

Score out of 100:

```text
ICP Fit             30
Company Fit         20
Buying Signals      25
Decision Maker      15
Evidence Quality    10
--------------------------------
Total              100
```

Example:

```python
{
    "score": 87,
    "score_breakdown": {
        "icp_fit": 27,
        "company_fit": 18,
        "buying_signals": 22,
        "decision_maker": 13,
        "evidence_quality": 7
    }
}
```

Never show a score without showing why.

## 14. Prospect Model

Use approximately:

```python
{
    "id": "xyz_001",
    "company": "XYZ Technologies",
    "website": "https://example.com",
    "industry": "SaaS",
    "location": "India",
    "company_size": "100-250",
    "description": "...",
    "score": 87,
    "score_breakdown": {
        "icp_fit": 27,
        "company_fit": 18,
        "buying_signals": 22,
        "decision_maker": 13,
        "evidence_quality": 7
    },
    "buying_signals": [
        {
            "text": "Hiring backend engineers",
            "source": "Public careers page",
            "source_url": "...",
            "confidence": 0.91
        }
    ],
    "decision_maker": {
        "name": "Jane Doe",
        "role": "CTO",
        "linkedin": "...",
        "email": "Not publicly verified",
        "confidence": 0.87
    },
    "sources": [],
    "research_summary": "...",
    "email_sequence": {
        "step_1": "...",
        "step_2": "...",
        "step_3": "..."
    }
}
```

## 15. Outreach

Generate a personalized 3-step sequence:

```text
Day 0 → Initial email
Day 3 → Follow-up
Day 7 → Final follow-up
```

Personalization must reference actual research. Never invent facts.

Support:
- Direct
- Professional
- Research Roundup

Tone may change; factual claims may not.

## 16. Human-in-the-Loop

AI researches, scores and drafts.

Human approves.

The MVP must NOT automatically send email.

`Approve & Send` means move the approved sequence to the Ready-to-Send queue.

## 17. Frontend Information Architecture

Use a premium AI workspace, not a generic dashboard.

Recommended desktop structure:

```text
┌─────────────────────────────────────────────────────────────┐
│ Header / Campaign / Settings                               │
├───────────────┬──────────────────────────┬─────────────────┤
│ Campaigns     │ AI Research Workspace    │ Prospects       │
│               │                          │                 │
│ + New         │ Conversation             │ Lead cards      │
│ Campaign 1    │ Research activity        │ Scores          │
│ Campaign 2    │ Chat input               │ Signals         │
│               │                          │ Decision maker  │
└───────────────┴──────────────────────────┴─────────────────┘
```

Do not rigidly copy this if a better responsive design emerges.

## 18. Frontend Components

Recommended:

```text
components/
├── layout/
│   ├── AppShell
│   ├── Sidebar
│   └── Header
├── chat/
│   ├── ChatPanel
│   ├── ChatMessage
│   ├── ChatInput
│   └── ResearchActivity
├── prospects/
│   ├── ProspectCard
│   ├── ScoreBadge
│   ├── ScoreBreakdown
│   ├── BuyingSignal
│   ├── DecisionMaker
│   └── ProspectDetail
├── outreach/
│   ├── OutreachSequence
│   ├── EmailStep
│   └── ApprovalButton
└── ui/
```

Keep components reasonably small. Do not create dozens of tiny files unnecessarily.

## 19. Prospect Card

Immediately communicate:
- Company
- Score /100
- Industry
- Location
- Website
- Top buying signals
- Decision-maker
- Confidence
- Score breakdown
- Research summary
- CTA

Example hierarchy:

```text
XYZ Technologies                         87
SaaS · India

██████████████████░░

🔥 Hiring backend engineers
🔥 Engineering team expansion

Jane Doe
CTO

[View Research]       [Approve]
```

## 20. Prospect Detail

Sections:
1. Overview
2. Why this company
3. Buying signals
4. Decision maker
5. Evidence / sources
6. Score breakdown
7. Outreach sequence

It should feel like an AI-generated research brief.

## 21. Research Activity UI

Show meaningful progress:

```text
✓ Understanding request
✓ Research plan created
✓ Found 18 companies
✓ Verified company information
◌ Analyzing buying signals
○ Finding decision makers
○ Scoring opportunities
○ Writing outreach
```

Use subtle animation. Do not add fake long delays.

## 22. Campaign State

Campaign:

```python
{
    "id": "...",
    "name": "...",
    "messages": [],
    "intent": {},
    "research_plan": [],
    "prospects": [],
    "approved_emails": []
}
```

Switching campaigns preserves state. New campaign starts cleanly.

At minimum maintain:

```text
messages
intent
research_plan
prospects
approved_emails
current_campaign
campaigns
research_status
```

## 23. Backend API

Use FastAPI. Possible endpoints:

```text
POST /api/chat
POST /api/research
GET  /api/campaigns
POST /api/campaigns
GET  /api/prospects/{id}
POST /api/prospects/{id}/approve
DELETE /api/approved/{id}
```

Keep the API simple and adjust if a cleaner design emerges.

## 24. Demo Mode

Demo mode must work without API keys.

Use configuration such as:

```python
DEMO_MODE = True
```

Return approximately 5 realistic deterministic prospects.

Do not claim demo data is live.

Use the same provider contracts for demo and future live providers.

## 25. Error Handling

Graceful states:

No company found:
> I couldn't find strong matches yet. Try widening the company-size or geography criteria.

No decision maker:
> No publicly verified decision-maker found.

No email:
> Email not publicly verified.

Provider failure:
> Some research sources were unavailable. I kept the verified information and marked the missing evidence.

Never fabricate fallback data to hide failure.

## 26. Visual Design

Aim for:
- Dark premium AI workspace aesthetic
- Clean typography
- Rounded cards
- Subtle borders
- Soft gradients
- Restrained glow
- High contrast
- Generous spacing
- Polished empty states
- Tasteful animations

Avoid:
- Excessive neon
- Rainbow gradients
- Excessive glassmorphism
- Huge decorative elements
- Dense tables
- Dashboard clutter
- Generic SaaS-template appearance

## 27. Motion

Use Framer Motion where meaningful:
- Prospect cards appearing after research
- Score number animation
- Research status transitions
- Expand/collapse research
- Campaign switching
- Approval confirmation

Avoid animating everything.

## 28. Responsive Design

Desktop is the hackathon priority.

On smaller screens:
- Sidebar becomes collapsible
- Prospects stack below chat
- Detail view becomes full-screen/modal

## 29. Trust Rules

Never:
- Invent emails
- Invent LinkedIn profiles
- Invent buying signals
- Claim demo data is live
- Automatically send email
- Hide uncertainty
- Present inference as fact

Prefer labels such as:
- Verified
- Likely
- Inferred
- Not publicly verified

## 30. Project Structure

```text
district-02/
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── public/
│   └── package.json
├── backend/
│   ├── agents/
│   ├── models/
│   ├── providers/
│   ├── main.py
│   └── requirements.txt
├── skills.md
└── README.md
```

Use modularity without over-engineering.

## 31. Implementation Priority

### P0
- Next.js runs
- FastAPI runs
- Frontend/backend communicate
- Main workspace renders
- Chat works
- Demo research flow works
- Prospect cards appear
- Explainable score works
- Approval works
- Ready-to-send queue works

### P1
- Research activity animation
- Prospect detail
- Campaign switching
- Visual polish
- Evidence sections
- Outreach sequence UI

### P2
- Real LLM
- Real public research provider
- Better evidence extraction
- Better scoring

Skip until the core flow works:
- Auth
- Database
- CRM
- Email sending
- Production infrastructure

## 32. Acceptance Criteria

The MVP succeeds if:
1. Frontend starts cleanly.
2. Backend starts cleanly.
3. User can type a natural-language sales request.
4. Request becomes structured intent.
5. Research activity is displayed.
6. Demo prospects appear.
7. Every prospect has an explainable score.
8. Buying signals are visible.
9. Decision-maker information is visible.
10. Evidence is visible.
11. 3-step outreach is generated.
12. Prospect details can be opened.
13. Prospect can be approved.
14. Approval moves it to Ready to Send.
15. Approval does not erase chat/prospect state.
16. Approved item can be removed.
17. Campaign switching preserves state.
18. Demo mode works without API keys.
19. No fabricated contact information appears.
20. UI feels like a polished AI SaaS product rather than a prototype dashboard.

## 33. Killer Demo

User types:

> Find Indian SaaS companies with 50–500 employees that are hiring backend engineers. We sell a developer productivity platform.

Then:

```text
Understanding request
        ↓
Research plan
        ↓
Company discovery
        ↓
Buying signals
        ↓
Decision makers
        ↓
87/100 prospect
        ↓
Evidence
        ↓
Personalized outreach
        ↓
Approve
        ↓
Ready to Send
```

The judge should understand the value without needing an explanation of every implementation detail.

## 34. Differentiator

Traditional sales tools expose configuration complexity:

```text
Filters
→ databases
→ enrichment
→ lists
→ signals
→ contacts
→ sequences
```

District 02:

```text
"Here's who I want to sell to."
              ↓
      AI figures out the rest.
```

## 35. Final Product Principle

The product should make the user feel:

> I described the customer I want, and an expert sales researcher went and figured out who I should talk to — and showed me why.

That feeling is more important than the number of features.
