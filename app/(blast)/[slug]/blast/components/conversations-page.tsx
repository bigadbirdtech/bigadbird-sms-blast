"use client";
import { useState, useEffect } from "react";
import { api, Conversation, CallRecord, telephony } from "../lib/api";
import { Button } from "@crm/ui/components/button";
import Chat from "@carbon/icons-react/es/Chat";
import Download from "@carbon/icons-react/es/Download";
import Renew from "@carbon/icons-react/es/Renew";
import Close from "@carbon/icons-react/es/Close";
import SendAlt from "@carbon/icons-react/es/SendAlt";
import PhoneOutgoing from "@carbon/icons-react/es/PhoneOutgoing";
import Phone from "@carbon/icons-react/es/Phone";
import Checkmark from "@carbon/icons-react/es/Checkmark";
import { LiveCallModal } from "./live-call-modal";

export function ConversationsPage() {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    
    // Filters
    const [filterWaiting, setFilterWaiting] = useState(false);
    const [filterYes, setFilterYes] = useState(false);
    const [filterStop, setFilterStop] = useState(false);
    const [campaignFilter, setCampaignFilter] = useState("All");

    // Modal State for Text Chat
    const [activeChat, setActiveChat] = useState<Conversation | null>(null);
    const [isNewChat, setIsNewChat] = useState(false);
    const [replyText, setReplyText] = useState("");

    // Telephony / AI Calling States
    const [activeCall, setActiveCall] = useState<CallRecord | null>(null);
    const [autoCallYes, setAutoCallYes] = useState(true);
    const [batchCalling, setBatchCalling] = useState(false);
    const [batchProgress, setBatchProgress] = useState<{ total: number; inProgress: number; completed: number; booked: number } | null>(null);

    useEffect(() => {
        api.getConversations().then(setConversations);
    }, []);

    // Filtered list
    const filtered = conversations.filter(c => {
        const showAll = !filterWaiting && !filterYes && !filterStop;
        if (!showAll) {
            if (c.status === 'Waiting' && !filterWaiting) return false;
            if (c.status === 'Yes' && !filterYes) return false;
            if (c.status === 'STOP' && !filterStop) return false;
        }
        if (campaignFilter !== "All" && c.campaign !== campaignFilter) return false;
        return true;
    });

    const yesLeadsCount = conversations.filter(c => c.status === 'Yes').length;

    // Start single AI call
    const handleStartCall = async (conversation: Conversation) => {
        const lead = {
            id: conversation.id,
            name: conversation.receiverName,
            phone: conversation.receiverPhone,
            campaign: conversation.campaign
        };

        // Open modal immediately with ringing state
        telephony.initiateCall(lead, (updatedCall) => {
            setActiveCall({ ...updatedCall });
        });
    };

    // Start batch call on all "Yes" leads
    const handleBatchCallYes = async () => {
        const yesLeads = conversations
            .filter(c => c.status === 'Yes')
            .map(c => ({ id: c.id, name: c.receiverName, phone: c.receiverPhone, campaign: c.campaign }));

        if (yesLeads.length === 0) return;

        setBatchCalling(true);
        await telephony.initiateBatchCalls(yesLeads, (progress) => {
            setBatchProgress({ ...progress });
        });

        setTimeout(() => {
            setBatchCalling(false);
            setBatchProgress(null);
        }, 4000);
    };

    return (
        <div className="space-y-6 relative">
            
            {/* Live AI Phone Call Console Modal */}
            {activeCall && (
                <LiveCallModal 
                    call={activeCall} 
                    onClose={() => setActiveCall(null)} 
                />
            )}

            {/* Manual Text Chat Modal */}
            {(activeChat || isNewChat) && !activeCall && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col h-[600px]">
                        {/* Header */}
                        <div className="bg-white/5 px-6 py-4 border-b border-white/10 flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-bold text-white">
                                    {isNewChat ? "New Conversation" : activeChat?.receiverName}
                                </h3>
                                <p className="text-xs text-slate-400 font-mono mt-1">
                                    {isNewChat ? "Send a manual direct message" : activeChat?.receiverPhone}
                                </p>
                            </div>
                            <Button variant="ghost" className="text-slate-400 hover:text-white" onClick={() => { setActiveChat(null); setIsNewChat(false); setReplyText(""); }}>
                                <Close className="w-5 h-5" />
                            </Button>
                        </div>
                        
                        {/* Body (Messages) */}
                        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-950/50">
                            {isNewChat ? (
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm text-slate-400 mb-1 block">Recipient Phone Number</label>
                                        <input type="text" className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-white font-mono text-sm" placeholder="+1234567890" autoFocus />
                                    </div>
                                    <div>
                                        <label className="text-sm text-slate-400 mb-1 block">Send From (Your Number)</label>
                                        <select className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-white font-mono text-sm">
                                            <option>+18005550101 (Main Sales A)</option>
                                        </select>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="flex justify-center"><span className="text-[10px] text-slate-500 bg-white/5 px-2 py-1 rounded-full uppercase tracking-wider">Yesterday, 2:14 PM</span></div>
                                    
                                    {/* Outbound Bubble */}
                                    <div className="flex justify-end">
                                        <div className="bg-teal-600 text-white p-3 rounded-2xl rounded-tr-sm max-w-[80%] text-sm shadow-md">
                                            Hi {activeChat?.receiverName}, just touching base regarding your recent inquiry. Let me know if you have time for a quick chat!
                                        </div>
                                    </div>
                                    
                                    {/* Inbound Bubble */}
                                    <div className="flex justify-start">
                                        <div className="bg-slate-800 border border-white/10 text-white p-3 rounded-2xl rounded-tl-sm max-w-[80%] text-sm shadow-md">
                                            {activeChat?.note}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Footer (Reply Box & Actions) */}
                        <div className="bg-white/5 p-4 border-t border-white/10">
                            {!isNewChat && (
                                <div className="flex gap-2 mb-3">
                                    <Button 
                                        size="sm" 
                                        className="h-7 text-xs bg-teal-500 hover:bg-teal-400 text-stone-950 font-bold gap-1"
                                        onClick={() => {
                                            const chatToCall = activeChat;
                                            setActiveChat(null);
                                            if (chatToCall) handleStartCall(chatToCall);
                                        }}
                                    >
                                        <PhoneOutgoing className="w-3.5 h-3.5" /> Call with AI Now
                                    </Button>
                                    <Button size="sm" variant="outline" className="h-7 text-xs bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20">Mark Interested</Button>
                                    <Button size="sm" variant="outline" className="h-7 text-xs bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20">Do Not Contact (DNC)</Button>
                                </div>
                            )}
                            <div className="relative">
                                <textarea 
                                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 pr-16 text-white text-sm focus:outline-none focus:border-teal-500/50 resize-none h-24"
                                    placeholder="Type your message..."
                                    value={replyText}
                                    onChange={e => setReplyText(e.target.value)}
                                ></textarea>
                                <div className={`absolute bottom-3 left-3 text-xs ${replyText.length > 160 ? 'text-red-400' : 'text-slate-500'}`}>
                                    {replyText.length} / 160
                                </div>
                                <Button className="absolute bottom-3 right-3 bg-teal-500 hover:bg-teal-400 text-white rounded-lg p-2 h-auto" onClick={() => { setActiveChat(null); setIsNewChat(false); setReplyText(""); }}>
                                    <SendAlt className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Batch Parallel Calling Live Progress Banner */}
            {batchCalling && batchProgress && (
                <div className="bg-gradient-to-r from-teal-950/80 via-slate-900 to-purple-950/80 border border-teal-500/30 rounded-2xl p-4 shadow-xl flex items-center justify-between animate-fadeIn">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center animate-spin">
                            <Renew className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-white flex items-center gap-2">
                                <span>Parallel AI Agents Dialing {batchProgress.total} Leads</span>
                                <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[10px] font-mono">Fish Audio Engine</span>
                            </h4>
                            <p className="text-xs text-slate-400 mt-0.5">
                                Active Agents: <strong className="text-teal-300">{batchProgress.inProgress}</strong> • Completed: {batchProgress.completed}/{batchProgress.total} • Appointments Secured: <strong className="text-emerald-400">{batchProgress.booked}</strong>
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="text-xs font-mono text-emerald-400 font-bold">
                            {Math.round((batchProgress.completed / Math.max(1, batchProgress.total)) * 100)}% Complete
                        </span>
                    </div>
                </div>
            )}

            {/* Main Table View */}
            <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.4)]">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div className="flex flex-wrap items-center gap-3">
                        <label className="flex items-center gap-2 cursor-pointer bg-black/20 px-3 py-1.5 rounded-full border border-white/5 hover:bg-black/40 transition">
                            <input type="checkbox" className="accent-teal-500" checked={filterWaiting} onChange={e => setFilterWaiting(e.target.checked)} />
                            <span className="text-sm text-slate-300">Waiting For Reply</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer bg-black/20 px-3 py-1.5 rounded-full border border-white/5 hover:bg-black/40 transition">
                            <input type="checkbox" className="accent-emerald-500" checked={filterYes} onChange={e => setFilterYes(e.target.checked)} />
                            <span className="text-sm text-slate-300">Yes Replies ({yesLeadsCount})</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer bg-black/20 px-3 py-1.5 rounded-full border border-white/5 hover:bg-black/40 transition">
                            <input type="checkbox" className="accent-red-500" checked={filterStop} onChange={e => setFilterStop(e.target.checked)} />
                            <span className="text-sm text-slate-300">STOP Replies</span>
                        </label>

                        {/* Speed-to-Lead Auto-Call Toggle */}
                        <div className="h-6 w-px bg-white/10 mx-1 hidden sm:block" />
                        <button
                            onClick={() => {
                                const nextVal = !autoCallYes;
                                setAutoCallYes(nextVal);
                                telephony.setAutoCallYes(nextVal);
                            }}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono transition ${
                                autoCallYes 
                                    ? 'bg-teal-500/20 border-teal-500/50 text-teal-300 shadow-[0_0_15px_rgba(20,184,166,0.25)]' 
                                    : 'bg-black/30 border-white/10 text-slate-500 hover:text-slate-300'
                            }`}
                            title="When enabled, any inbound 'Yes' text reply automatically triggers an AI phone call within 15 seconds"
                        >
                            <span className={`w-2 h-2 rounded-full ${autoCallYes ? 'bg-teal-400 animate-pulse' : 'bg-slate-600'}`} />
                            <span>Auto-Call 'Yes' Replies {autoCallYes ? 'ON' : 'OFF'}</span>
                        </button>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        {/* Batch Call Action */}
                        <Button 
                            size="sm" 
                            className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-stone-950 font-bold gap-2 shadow-lg shadow-teal-500/20"
                            onClick={handleBatchCallYes}
                            disabled={batchCalling}
                        >
                            <PhoneOutgoing className="w-4 h-4" /> 
                            Call All {yesLeadsCount} "Yes" Leads
                        </Button>

                        <select className="bg-black/40 border border-white/10 text-slate-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-teal-500/50" value={campaignFilter} onChange={e => setCampaignFilter(e.target.value)}>
                            <option value="All" className="bg-slate-900 text-white">All Campaigns</option>
                            <option value="17 - Insurance Agents" className="bg-slate-900 text-white">17 - Insurance Agents</option>
                            <option value="21 - Roofing Agents" className="bg-slate-900 text-white">21 - Roofing Agents</option>
                        </select>
                        <Button variant="outline" size="sm" className="bg-white/5 border-white/10 text-white hover:bg-white/10"><Renew className="w-4 h-4" /></Button>
                        <Button variant="outline" size="sm" className="bg-white/5 border-white/10 text-white hover:bg-white/10 gap-2"><Download className="w-4 h-4" /> Export</Button>
                        <Button size="sm" className="bg-teal-500 hover:bg-teal-400 text-white gap-2" onClick={() => setIsNewChat(true)}><Chat className="w-4 h-4" /> New Conversation</Button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-300">
                        <thead className="text-xs uppercase bg-purple-900/30 text-purple-200/80 border-b border-purple-500/20">
                            <tr>
                                <th className="px-4 py-3 font-medium">Receiver Name</th>
                                <th className="px-4 py-3 font-medium">Receiver Phone Number</th>
                                <th className="px-4 py-3 font-medium">Sender Phone Number</th>
                                <th className="px-4 py-3 font-medium">Note</th>
                                <th className="px-4 py-3 font-medium text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filtered.slice(0, 25).map(c => {
                                const isYes = c.status === 'Yes';
                                return (
                                    <tr key={c.id} className="hover:bg-white/5 transition-colors group cursor-default" onClick={() => setActiveChat(c)}>
                                        <td className="px-4 py-3 font-medium text-white">{c.receiverName}</td>
                                        <td className="px-4 py-3 font-mono">{c.receiverPhone}</td>
                                        <td className="px-4 py-3 font-mono">{c.senderPhone}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                                    isYes ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-black' :
                                                    c.status === 'STOP' ? 'bg-red-500/20 text-red-400' :
                                                    'bg-slate-500/20 text-slate-400'
                                                }`}>
                                                    {c.status}
                                                </span>
                                                <span className="truncate max-w-[200px]" title={c.note}>{c.note}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-2" onClick={e => e.stopPropagation()}>
                                                {/* 1-Click AI Call Trigger Button */}
                                                <Button 
                                                    size="sm" 
                                                    className={`h-7 text-xs font-bold gap-1 transition-all ${
                                                        isYes 
                                                            ? 'bg-teal-500 hover:bg-teal-400 text-stone-950 shadow-[0_0_12px_rgba(20,184,166,0.4)] scale-105' 
                                                            : 'bg-white/10 hover:bg-white/20 text-slate-200'
                                                    }`}
                                                    onClick={() => handleStartCall(c)}
                                                    title="Trigger AI phone qualification call with Fish Audio voice"
                                                >
                                                    <PhoneOutgoing className="w-3.5 h-3.5" />
                                                    <span>{isYes ? '📞 AI Call' : 'Call'}</span>
                                                </Button>

                                                <Button 
                                                    size="sm" 
                                                    variant="outline" 
                                                    className="h-7 text-xs bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-teal-300 transition" 
                                                    onClick={() => setActiveChat(c)}
                                                >
                                                    Reply
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <div className="mt-4 flex justify-between items-center text-xs text-slate-500">
                    <div>Showing {Math.min(filtered.length, 25)} of {filtered.length} entries</div>
                    <div className="flex gap-1">
                        <Button variant="ghost" size="sm" disabled className="h-7 px-2">Prev</Button>
                        <Button variant="ghost" size="sm" className="h-7 px-2 bg-white/5">1</Button>
                        <Button variant="ghost" size="sm" className="h-7 px-2 hover:bg-white/10">2</Button>
                        <Button variant="ghost" size="sm" className="h-7 px-2 hover:bg-white/10">Next</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
