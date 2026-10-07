from typing import Literal
from pydantic import BaseModel, Field


class Intent(BaseModel):
    product: str
    target_market: str = "B2B SaaS"
    industry: list[str] = ["SaaS"]
    company_size: str = "50-500"
    geography: list[str] = ["India"]
    decision_maker: list[str] = ["CTO", "VP Engineering", "Head of Engineering"]
    buying_signals: list[str] = ["backend engineering hiring", "engineering team growth"]
    outreach_style: Literal["direct", "professional", "research_roundup"] = "professional"


class Signal(BaseModel):
    text: str
    source: str
    source_url: str | None = None
    confidence: float


class DecisionMaker(BaseModel):
    name: str
    role: str
    linkedin: str | None = None
    email: str = "Not publicly verified"
    confidence: float


class Evidence(BaseModel):
    fact: str
    inference: str
    confidence: Literal["High", "Medium", "Low"]
    source: str
    source_url: str | None = None


class ScoreBreakdown(BaseModel):
    icp_fit: int = Field(le=30)
    company_fit: int = Field(le=20)
    buying_signals: int = Field(le=25)
    decision_maker: int = Field(le=15)
    evidence_quality: int = Field(le=10)


class EmailStep(BaseModel):
    day: int
    subject: str
    body: str


class Prospect(BaseModel):
    id: str
    company: str
    website: str
    industry: str
    location: str
    company_size: str
    description: str
    score: int
    score_breakdown: ScoreBreakdown
    buying_signals: list[Signal]
    decision_maker: DecisionMaker
    evidence: list[Evidence]
    research_summary: str
    outreach: list[EmailStep]


class ChatRequest(BaseModel):
    message: str
    campaign_id: str | None = None


class ResearchResponse(BaseModel):
    reply: str
    intent: Intent
    plan: list[str]
    prospects: list[Prospect]
    activity: list[str]


class CampaignCreate(BaseModel):
    name: str


class ApprovalRequest(BaseModel):
    campaign_id: str
