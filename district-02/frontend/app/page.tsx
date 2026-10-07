"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, ChevronDown, Inbox, Search, Trash2 } from "lucide-react";
import { ChatPanel } from "@/components/chat-panel";
import { ProspectCard } from "@/components/prospect-card";
import { ProspectDetail } from "@/components/prospect-detail";
import { Sidebar } from "@/components/sidebar";
import { runResearch } from "@/lib/api";
import type { Campaign, Prospect } from "@/lib/types";

const initialCampaign: Campaign = { id: "campaign_default", name: "Developer productivity — India", messages: [], prospects: [], approved: [], activity: [], plan: [] };

export default function Home() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([initialCampaign]);
  const [currentId, setCurrentId] = useState(initialCampaign.id);
  const [researching, setResearching] = useState(false);
  const [selected, setSelected] = useState<Prospect | null>(null);
  const [showQueue, setShowQueue] = useState(false);
  const current = campaigns.find((campaign) => campaign.id === currentId) ?? campaigns[0];
  const queue = useMemo(() => campaigns.flatMap(campaign => campaign.prospects.filter(prospect => campaign.approved.includes(prospect.id)).map(prospect => ({ prospect, campaign }))), [campaigns]);
  function updateCurrent(update: (campaign: Campaign) => Campaign) { setCampaigns(all => all.map(campaign => campaign.id === currentId ? update(campaign) : campaign)); }
  function createCampaign() { const number = campaigns.length + 1; const campaign = { id: `local_${Date.now()}`, name: `New research ${number}`, messages: [], prospects: [], approved: [], activity: [], plan: [] }; setCampaigns([...campaigns, campaign]); setCurrentId(campaign.id); setSelected(null); }
  async function startResearch(message: string) {
    updateCurrent(campaign => ({ ...campaign, messages: [...campaign.messages, { role: "user", content: message }], activity: ["Understanding request", "Research plan created", "Finding matching companies", "Verifying company information"] })); setResearching(true);
    try { const result = await runResearch(message, currentId); updateCurrent(campaign => ({ ...campaign, messages: [...campaign.messages, { role: "assistant", content: result.reply }], prospects: result.prospects, activity: result.activity, plan: result.plan })); }
    catch { updateCurrent(campaign => ({ ...campaign, messages: [...campaign.messages, { role: "assistant", content: "I couldn’t reach the local research service. Start the FastAPI backend and try again; I’ll keep your request here." }], activity: [] })); }
    finally { setResearching(false); }
  }
  function approve(id: string) { updateCurrent(campaign => campaign.approved.includes(id) ? campaign : { ...campaign, approved: [...campaign.approved, id] }); }
  function removeFromQueue(id: string, campaignId: string) { setCampaigns(all => all.map(campaign => campaign.id === campaignId ? { ...campaign, approved: campaign.approved.filter(item => item !== id) } : campaign)); }
  return <div className="app-shell"><Sidebar campaigns={campaigns} currentId={currentId} onSelect={(id) => { setCurrentId(id); setSelected(null); }} onCreate={createCampaign} queueCount={queue.length} /><section className="workspace"><header className="topbar"><button className="campaign-switcher" onClick={() => setShowQueue(false)}><span className="campaign-initial">D</span><span>{current.name}</span><ChevronDown size={15} /></button><div className="top-actions"><button className="icon-button"><Search size={17} /></button><button className="icon-button notification"><Bell size={17} /><i /></button><span className="user-avatar">JA</span></div></header><div className="workspace-grid"><ChatPanel messages={current.messages} activity={current.activity} plan={current.plan} researching={researching} onSubmit={startResearch} /><aside className="prospects-panel"><header className="prospects-header"><div><span className="eyebrow"><span /> SHORTLIST</span><h2>Prospects <b>{current.prospects.length || "—"}</b></h2></div><button className={`queue-button ${showQueue ? "selected" : ""}`} onClick={() => setShowQueue(!showQueue)}><Inbox size={15} /> Queue <span>{queue.length}</span></button></header><AnimatePresence mode="wait">{showQueue ? <motion.div key="queue" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="queue-list"><div className="queue-title"><Inbox size={15} /> Ready to send</div>{queue.length ? queue.map(({ prospect, campaign }) => <article className="queue-item" key={`${campaign.id}-${prospect.id}`}><div><b>{prospect.company}</b><span>{prospect.decision_maker.name} · 3 emails ready</span></div><button aria-label="Remove from queue" onClick={() => removeFromQueue(prospect.id, campaign.id)}><Trash2 size={15} /></button></article>) : <div className="empty-queue"><Inbox size={22} /><p>Your approved sequences will appear here.</p></div>}</motion.div> : current.prospects.length ? <motion.div key="prospects" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="prospect-list">{current.prospects.map(prospect => <ProspectCard key={prospect.id} prospect={prospect} approved={current.approved.includes(prospect.id)} onOpen={() => setSelected(prospect)} onApprove={() => approve(prospect.id)} />)}</motion.div> : <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="empty-prospects"><div><Search size={21} /></div><h3>Your shortlist will appear here</h3><p>Describe a market or a signal, and District 02 will build your research brief.</p></motion.div>}</AnimatePresence></aside></div></section><ProspectDetail prospect={selected} approved={!!selected && current.approved.includes(selected.id)} onClose={() => setSelected(null)} onApprove={() => selected && approve(selected.id)} /></div>;
}
