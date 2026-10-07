"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, Check, Circle, Compass, Sparkles } from "lucide-react";
import { useState } from "react";
import type { Message } from "@/lib/types";

const suggestion = "Find Indian SaaS companies with 50–500 employees that are hiring backend engineers. We sell a developer productivity platform.";

export function ChatPanel({ messages, activity, plan, researching, onSubmit }: { messages: Message[]; activity: string[]; plan: string[]; researching: boolean; onSubmit: (value: string) => void }) {
  const [value, setValue] = useState("");
  const send = () => { if (value.trim()) { onSubmit(value.trim()); setValue(""); } };
  const hasConversation = messages.length > 0;
  return <main className="chat-panel">
    <div className="center-header"><div><div className="eyebrow"><span /> CAMPAIGN RESEARCH</div><h1>Find the companies <em>ready</em> to talk.</h1></div><button className="share-button">Share</button></div>
    <div className={`conversation ${hasConversation ? "has-conversation" : ""}`}>
      {!hasConversation && <div className="welcome"><div className="orb"><Sparkles size={22} /></div><h2>What are you looking for?</h2><p>Describe your ideal customer in your own words. I&apos;ll turn it into a focused research plan.</p><button onClick={() => setValue(suggestion)} className="suggestion"><Compass size={15} /><span>Try an example</span><b>Indian SaaS companies hiring backend engineers</b></button></div>}
      {messages.map((message, index) => <motion.div initial={{ opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.03 }} className={`message ${message.role}`} key={`${message.content}-${index}`}><div className="message-label">{message.role === "assistant" ? "DISTRICT 02" : "YOU"}</div><p>{message.content}</p></motion.div>)}
      <AnimatePresence>{(researching || activity.length > 0) && <motion.section initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="activity"><div className="activity-title"><span className="pulse-dot" /> Research activity <small>{researching ? "Working" : "Complete"}</small></div>{activity.map((step, index) => <div className="activity-row" key={step}>{researching && index > 3 ? <Circle size={14} /> : <Check size={14} />}<span>{step}</span>{index === 1 && plan.length > 0 && <span className="plan-detail">Plan ready</span>}</div>)}</motion.section>}</AnimatePresence>
    </div>
    <div className="composer-wrap"><div className="composer"><textarea value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }} placeholder="Describe the customers you want to reach…" rows={2} /><button aria-label="Start research" onClick={send} disabled={!value.trim() || researching}><ArrowUp size={18} /></button></div><p><Sparkles size={12} /> Research uses clearly-labelled deterministic demo data. No emails are sent automatically.</p></div>
  </main>;
}
