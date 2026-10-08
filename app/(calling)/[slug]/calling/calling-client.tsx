"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { telephony, CallRecord, TelephonyConfig } from "@/lib/telephony";
import { Button } from "@crm/ui/components/button";
import PhoneOutgoing from "@carbon/icons-react/es/PhoneOutgoing";
import Checkmark from "@carbon/icons-react/es/Checkmark";
import Renew from "@carbon/icons-react/es/Renew";
import Play from "@carbon/icons-react/es/Play";
import ArrowLeft from "@carbon/icons-react/es/ArrowLeft";
import Security from "@carbon/icons-react/es/Security";
import { LiveCallModal } from "./live-call-modal";

export function CallingClient({ workspaceSlug }: { workspaceSlug: string }) {
    const [config, setConfig] = useState<TelephonyConfig | null>(null);
    const [callHistory, setCallHistory] = useState<CallRecord[]>([]);
    const [activeCall, setActiveCall] = useState<CallRecord | null>(null);

    // Custom Test Call Input
    const [testName, setTestName] = useState("Michael");
    const [testPhone, setTestPhone] = useState("+13125550199");
    const [isDialing, setIsDialing] = useState(false);

    useEffect(() => {
        setConfig(telephony.getConfig());
        telephony.getCallHistory().then(setCallHistory);
    }, []);

    const handleTriggerTestCall = async () => {
        if (!testPhone.trim()) return;
        setIsDialing(true);

        const lead = {
            name: testName || "Test Prospect",
            phone: testPhone,
            campaign: "Direct Voice Console"
        };

        telephony.initiateCall(lead, (updatedCall) => {
            setActiveCall({ ...updatedCall });
            telephony.getCallHistory().then(setCallHistory);
            if (updatedCall.status === 'Completed') {
                setIsDialing(false);
            }
        });
    };

    return (
        <div className="w-full flex-1 h-full bg-transparent text-slate-100 font-sans p-6 lg:p-8 overflow-y-auto relative z-0">
            <div className="max-w-[1680px] mx-auto space-y-6">
                
                {/* Live Call Console Modal */}
                {activeCall && (
                    <LiveCallModal 
                        call={activeCall} 
                        onClose={() => setActiveCall(null)} 
                    />
                )}

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
                            <span className="text-[10px] font-mono font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20">
                                🟢 SIP TRUNKS CONNECTED
                            </span>
                        </div>
                        <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                            AI Voice & Calling <span className="text-blue-400 font-mono text-xl font-normal">/ Standalone Studio</span>
                        </h1>
                        <p className="text-slate-400 text-xs mt-1">Autonomous conversational voice agents, live transcript audio stream, and smart IVR routing.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="bg-white/[0.03] backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 text-right">
                            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">TTS Latency</div>
                            <div className="text-sm font-mono font-bold text-teal-400">&lt; 180ms</div>
                        </div>
                        <div className="bg-white/[0.03] backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 text-right">
                            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Voice Synthesis</div>
                            <div className="text-sm font-mono font-bold text-emerald-400">Fish Audio S2.1-Pro</div>
                        </div>
                    </div>
                </div>

                {/* Top Telemetry & Carrier Status Banner */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 backdrop-blur-xl">
                        <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block mb-1">TELECOM CARRIER</span>
                        <div className="flex items-center justify-between">
                            <span className="text-base font-bold text-white">Telnyx SIP Trunking</span>
                            <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">ONLINE</span>
                        </div>
                    </div>

                    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 backdrop-blur-xl">
                        <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block mb-1">DATABASE & LOGS</span>
                        <div className="flex items-center justify-between">
                            <span className="text-base font-bold text-white">Supabase Postgres</span>
                            <span className="text-xs px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">SYNCED</span>
                        </div>
                    </div>

                    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 backdrop-blur-xl">
                        <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block mb-1">VOICE AI ENGINE</span>
                        <div className="flex items-center justify-between">
                            <span className="text-base font-bold text-white">Fish Audio Neural</span>
                            <span className="text-xs px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">READY</span>
                        </div>
                    </div>

                    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 backdrop-blur-xl">
                        <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block mb-1">AUTO RECORDING</span>
                        <div className="flex items-center justify-between">
                            <span className="text-base font-bold text-white">Full Stereo WAV</span>
                            <span className="text-xs px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">ACTIVE</span>
                        </div>
                    </div>
                </div>

                {/* Live Test Call Launcher Box */}
                <div className="bg-gradient-to-r from-blue-900/20 via-purple-900/10 to-teal-900/20 border border-blue-500/30 rounded-2xl p-6 backdrop-blur-xl">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="space-y-1">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <PhoneOutgoing className="text-blue-400 w-5 h-5" /> Launch Real-Time AI Phone Call
                            </h3>
                            <p className="text-xs text-slate-400">
                                Initiates a live conversational call session. Features audible voice synthesis via your speakers and real-time transcript streaming.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                            <input 
                                type="text" 
                                value={testName}
                                onChange={e => setTestName(e.target.value)}
                                placeholder="Lead Name" 
                                className="bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50 w-36"
                            />
                            <input 
                                type="text" 
                                value={testPhone}
                                onChange={e => setTestPhone(e.target.value)}
                                placeholder="Phone Number" 
                                className="bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50 w-44 font-mono"
                            />
                            <Button 
                                onClick={handleTriggerTestCall}
                                disabled={isDialing}
                                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold gap-2 shadow-[0_0_20px_rgba(59,130,246,0.35)] px-6"
                            >
                                {isDialing ? <Renew className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                                {isDialing ? "Dialing Line..." : "Simulate Live Call"}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Call History Table */}
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-white">Call Logs & Audio Transcripts</h3>
                            <p className="text-xs text-slate-400 mt-1">Real-time transcripts, outcome classification, and AI qualification notes.</p>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-300">
                            <thead className="text-xs uppercase bg-blue-900/20 text-blue-200/80 border-b border-blue-500/20">
                                <tr>
                                    <th className="px-4 py-3 font-medium">Recipient</th>
                                    <th className="px-4 py-3 font-medium">Phone Number</th>
                                    <th className="px-4 py-3 font-medium">Outcome</th>
                                    <th className="px-4 py-3 font-medium">Duration</th>
                                    <th className="px-4 py-3 font-medium">Date & Time</th>
                                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 font-sans">
                                {callHistory.map(call => (
                                    <tr key={call.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-4 py-4 font-bold text-white">{call.receiverName}</td>
                                        <td className="px-4 py-4 font-mono text-slate-400">{call.receiverPhone}</td>
                                        <td className="px-4 py-4">
                                            <span className={`text-xs px-2.5 py-1 rounded-full font-bold border ${
                                                call.status === 'Completed' 
                                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                                                    : call.status === 'Connected' 
                                                    ? 'bg-blue-500/10 text-blue-400 border-blue-500/20 animate-pulse' 
                                                    : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                            }`}>
                                                {call.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 font-mono text-slate-300">{call.durationSeconds}s</td>
                                        <td className="px-4 py-4 text-xs text-slate-500">{new Date(call.startedAt).toLocaleString()}</td>
                                        <td className="px-4 py-4 text-right">
                                            <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                className="text-blue-400 hover:text-white hover:bg-blue-600/20 text-xs"
                                                onClick={() => setActiveCall(call)}
                                            >
                                                Inspect Transcript →
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
}
