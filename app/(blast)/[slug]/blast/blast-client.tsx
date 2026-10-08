"use client";
import Link from "next/link";
import { useState } from "react";
import { ConversationsPage } from "./components/conversations-page";
import { CampaignsPage } from "./components/campaigns-page";
import { TemplatesPage } from "./components/templates-page";
import { GroupsPage } from "./components/groups-page";
import { ListsPage } from "./components/lists-page";
import { StatusPage } from "./components/status-page";
import { UsersPage } from "./components/users-page";
import Security from "@carbon/icons-react/es/Security";
import ArrowLeft from "@carbon/icons-react/es/ArrowLeft";
import CheckmarkFilled from "@carbon/icons-react/es/CheckmarkFilled";

const TABS = [
    "CONVERSATIONS", "CAMPAIGNS", "TEMPLATES", "GROUPS", "LISTS", "STATUS", "USERS"
];

export function BlastDashboard({ workspaceSlug }: { workspaceSlug: string }) {
    const [activeTab, setActiveTab] = useState("CONVERSATIONS");
    const [isLoggedIn, setIsLoggedIn] = useState(true); // the real login is app/login; this old client-side gate is no longer needed
    const [agentEmail, setAgentEmail] = useState("admin@bigadbird.com");
    const [pin, setPin] = useState("••••••••");

    if (!isLoggedIn) {
        return (
            <div className="w-full flex-1 h-full bg-transparent flex items-center justify-center p-6 relative z-0 font-sans">
                {/* Background Ambient Glow */}
                <div className="absolute w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[140px] pointer-events-none" />
                
                <div className="bg-white/[0.04] backdrop-blur-3xl border border-white/10 rounded-3xl p-10 shadow-[0_16px_48px_0_rgba(0,0,0,0.6)] w-full max-w-md text-center relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500/20 to-teal-500/5 border border-teal-500/30 flex items-center justify-center mx-auto mb-6 text-teal-400 shadow-[0_0_30px_rgba(20,184,166,0.25)]">
                        <Security className="w-8 h-8" />
                    </div>
                    
                    <div className="inline-block px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-[10px] font-mono font-bold tracking-widest uppercase mb-3">
                        TELECOM SECURITY CLEARANCE
                    </div>
                    
                    <h2 className="text-3xl font-black uppercase tracking-tight text-white mb-2">Blast <span className="text-teal-400">Secure</span></h2>
                    <p className="text-slate-400 text-xs leading-relaxed mb-8">
                        Dedicated carrier authorization required to dispatch high-throughput SMS traffic and voice trunks.
                    </p>
                    
                    <div className="space-y-4 text-left">
                        <div>
                            <label className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1.5 block">Authorized Operator Email</label>
                            <input 
                                type="email" 
                                value={agentEmail} 
                                onChange={e => setAgentEmail(e.target.value)} 
                                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-teal-500/50 transition font-mono" 
                                placeholder="operator@company.com" 
                            />
                        </div>
                        <div>
                            <label className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1.5 block">Security Key / PIN</label>
                            <input 
                                type="password" 
                                value={pin} 
                                onChange={e => setPin(e.target.value)} 
                                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-teal-500/50 transition font-mono" 
                                placeholder="••••••••" 
                            />
                        </div>
                        
                        <button 
                            onClick={() => setIsLoggedIn(true)}
                            className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-slate-950 font-black tracking-wider text-xs py-3.5 rounded-xl shadow-[0_0_30px_rgba(20,184,166,0.35)] mt-4 transition-all duration-300 cursor-pointer uppercase flex items-center justify-center gap-2"
                        >
                            <CheckmarkFilled className="w-4 h-4" /> AUTHORIZE & INITIALIZE
                        </button>
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center text-xs">
                        <Link href={`/${workspaceSlug}`} className="text-slate-500 hover:text-white inline-flex items-center gap-1.5 uppercase tracking-wider transition text-[11px]">
                            <ArrowLeft className="w-3.5 h-3.5" /> Return to HQ
                        </Link>
                        <span className="text-[10px] text-slate-600 font-mono">TELNYX V2 • ENCRYPTED</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full flex-1 h-full bg-transparent text-slate-100 font-sans p-6 lg:p-8 overflow-y-auto relative z-0">
            <div className="max-w-[1680px] mx-auto space-y-6">
                
                {/* Header Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Link 
                                href={`/${workspaceSlug}`} 
                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/[0.04] border border-white/10 hover:border-purple-500/50 hover:bg-white/[0.08] text-xs font-bold uppercase tracking-wider text-purple-300 transition-all"
                            >
                                <ArrowLeft className="w-3 h-3" /> Back to HQ
                            </Link>
                            <span className="text-[10px] font-mono font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/20">
                                🟢 10DLC ACTIVE
                            </span>
                        </div>
                        <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                            Blast <span className="text-teal-400 font-mono text-xl font-normal">/ Telecom Ops</span>
                        </h1>
                        <p className="text-slate-400 text-xs mt-1">High-throughput SMS dispatcher, rotation pools, and compliance telemetry.</p>
                    </div>

                    {/* Quick Metric Pills */}
                    <div className="flex items-center gap-3">
                        <div className="bg-white/[0.03] backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 text-right">
                            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Daily Quota</div>
                            <div className="text-sm font-mono font-bold text-teal-400">950 <span className="text-slate-500 font-normal">/ 1,000</span></div>
                        </div>
                        <div className="bg-white/[0.03] backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 text-right">
                            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Delivery Rate</div>
                            <div className="text-sm font-mono font-bold text-emerald-400">99.2%</div>
                        </div>
                    </div>
                </div>

                {/* Top Navigation Tab Bar (Glassmorphic Pill Bar) */}
                <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] overflow-x-auto w-full max-w-full">
                    {TABS.map(tab => (
                        <button 
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-5 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase transition-all duration-200 whitespace-nowrap cursor-pointer ${
                                activeTab === tab 
                                    ? 'bg-gradient-to-r from-purple-600/40 to-indigo-600/40 text-white shadow-[0_0_20px_rgba(168,85,247,0.35)] border border-purple-500/50' 
                                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Page Content View */}
                <div className="w-full pt-2">
                    {activeTab === "CONVERSATIONS" && <ConversationsPage />}
                    {activeTab === "CAMPAIGNS" && <CampaignsPage />}
                    {activeTab === "TEMPLATES" && <TemplatesPage />}
                    {activeTab === "GROUPS" && <GroupsPage />}
                    {activeTab === "LISTS" && <ListsPage />}
                    {activeTab === "STATUS" && <StatusPage />}
                    {activeTab === "USERS" && <UsersPage />}
                </div>

            </div>
        </div>
    );
}
