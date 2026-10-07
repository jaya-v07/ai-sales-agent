"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Check, Flame, MapPin, UserRound } from "lucide-react";
import type { Prospect } from "@/lib/types";

export function ProspectCard({ prospect, approved, onOpen, onApprove }: { prospect: Prospect; approved: boolean; onOpen: () => void; onApprove: () => void }) {
  return <motion.article initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="prospect-card">
    <div className="prospect-top"><div className="company-avatar">{prospect.company.slice(0, 1)}</div><div className="company-title"><h3>{prospect.company}</h3><p>{prospect.industry}</p></div><div className="score"><strong>{prospect.score}</strong><span>/100</span></div></div>
    <div className="meta"><span><MapPin size={12} /> {prospect.location}</span><span>{prospect.company_size} people</span></div>
    <div className="score-bar"><i style={{ width: `${prospect.score}%` }} /></div>
    <div className="signals">{prospect.buying_signals.slice(0, 2).map(signal => <div key={signal.text}><Flame size={14} />{signal.text}</div>)}</div>
    <div className="person"><span className="person-avatar"><UserRound size={14} /></span><div><b>{prospect.decision_maker.name}</b><span>{prospect.decision_maker.role} · {Math.round(prospect.decision_maker.confidence * 100)}% confidence</span></div></div>
    <div className="card-actions"><button onClick={onOpen}>View research <ArrowUpRight size={14} /></button><button className={approved ? "approved" : "approve"} onClick={onApprove}>{approved ? <><Check size={14} /> Queued</> : "Approve"}</button></div>
  </motion.article>;
}
