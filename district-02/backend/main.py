import os

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from agents import run_research
from models.schemas import ApprovalRequest, CampaignCreate, ChatRequest, ResearchResponse

DEMO_MODE = os.getenv("DEMO_MODE", "true").lower() == "true"
FRONTEND_URLS = [origin.strip() for origin in os.getenv("FRONTEND_URL", "http://localhost:3000").split(",") if origin.strip()]
app = FastAPI(title="District 02 API", version="0.1.0")
app.add_middleware(CORSMiddleware, allow_origins=FRONTEND_URLS, allow_credentials=True, allow_methods=["GET", "POST", "DELETE"], allow_headers=["Content-Type"])

campaigns = [{"id": "campaign_default", "name": "Developer productivity — India", "messages": [], "prospects": [], "approved_emails": []}]


@app.get("/health")
def health():
    return {"status": "ok", "demo_mode": DEMO_MODE}


@app.post("/api/chat", response_model=ResearchResponse)
def chat(request: ChatRequest):
    result = run_research(request.message)
    if request.campaign_id:
        for campaign in campaigns:
            if campaign["id"] == request.campaign_id:
                campaign["messages"].append({"role": "user", "content": request.message})
                campaign["messages"].append({"role": "assistant", "content": result["reply"]})
                campaign["prospects"] = [p.model_dump() for p in result["prospects"]]
                break
    return result


@app.get("/api/campaigns")
def get_campaigns():
    return campaigns


@app.post("/api/campaigns")
def create_campaign(payload: CampaignCreate):
    item = {"id": f"campaign_{len(campaigns) + 1}", "name": payload.name, "messages": [], "prospects": [], "approved_emails": []}
    campaigns.append(item)
    return item


@app.get("/api/prospects/{prospect_id}")
def get_prospect(prospect_id: str):
    for campaign in campaigns:
        for prospect in campaign["prospects"]:
            if prospect["id"] == prospect_id:
                return prospect
    raise HTTPException(404, "Prospect not found")


@app.post("/api/prospects/{prospect_id}/approve")
def approve_prospect(prospect_id: str, payload: ApprovalRequest):
    campaign = next((item for item in campaigns if item["id"] == payload.campaign_id), None)
    if not campaign or not any(item["id"] == prospect_id for item in campaign["prospects"]):
        raise HTTPException(404, "Prospect not found")
    if prospect_id not in campaign["approved_emails"]:
        campaign["approved_emails"].append(prospect_id)
    return {"prospect_id": prospect_id, "status": "ready_to_send"}


@app.delete("/api/approved/{prospect_id}")
def remove_approved(prospect_id: str, campaign_id: str):
    campaign = next((item for item in campaigns if item["id"] == campaign_id), None)
    if not campaign:
        raise HTTPException(404, "Campaign not found")
    campaign["approved_emails"] = [item for item in campaign["approved_emails"] if item != prospect_id]
    return {"prospect_id": prospect_id, "status": "removed_from_queue"}
