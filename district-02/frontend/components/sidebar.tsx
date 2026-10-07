"use client";

import { Archive, ChevronDown, LayoutGrid, Plus, Settings2, Sparkles } from "lucide-react";
import type { Campaign } from "@/lib/types";

export function Sidebar({ campaigns, currentId, onSelect, onCreate, queueCount }: { campaigns: Campaign[]; currentId: string; onSelect: (id: string) => void; onCreate: () => void; queueCount: number }) {
  return <aside className="sidebar">
    <div className="brand"><span className="brand-mark"><Sparkles size={16} /></span><span>DISTRICT <b>02</b></span></div>
    <button className="new-campaign" onClick={onCreate}><Plus size={16} /> New campaign</button>
    <div className="nav-label">WORKSPACE</div>
    <button className="nav-link active"><LayoutGrid size={16} /> Research workspace</button>
    <button className="nav-link"><Archive size={16} /> Ready to send <span className="nav-count">{queueCount}</span></button>
    <div className="nav-label campaigns-label">CAMPAIGNS <ChevronDown size={13} /></div>
    <div className="campaign-list">{campaigns.map((campaign) => <button key={campaign.id} onClick={() => onSelect(campaign.id)} className={`campaign-link ${campaign.id === currentId ? "selected" : ""}`}><span className="campaign-dot" />{campaign.name}</button>)}</div>
    <div className="sidebar-bottom"><button className="nav-link"><Settings2 size={16} /> Settings</button><div className="demo-pill"><span /> Demo mode</div></div>
  </aside>;
}
