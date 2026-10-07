export type ScoreBreakdown = { icp_fit: number; company_fit: number; buying_signals: number; decision_maker: number; evidence_quality: number };
export type Signal = { text: string; source: string; source_url?: string | null; confidence: number };
export type Evidence = { fact: string; inference: string; confidence: "High" | "Medium" | "Low"; source: string; source_url?: string | null };
export type OutreachStep = { day: number; subject: string; body: string };
export type Prospect = { id: string; company: string; website: string; industry: string; location: string; company_size: string; description: string; score: number; score_breakdown: ScoreBreakdown; buying_signals: Signal[]; decision_maker: { name: string; role: string; linkedin?: string | null; email: string; confidence: number }; evidence: Evidence[]; research_summary: string; outreach: OutreachStep[] };
export type Message = { role: "user" | "assistant"; content: string };
export type Campaign = { id: string; name: string; messages: Message[]; prospects: Prospect[]; approved: string[]; activity: string[]; plan: string[] };
