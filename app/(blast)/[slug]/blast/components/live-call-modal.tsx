"use client";
import { useState, useEffect, useRef } from "react";
import { CallRecord, CallTranscriptMessage } from "../lib/telephony";
import { Button } from "@crm/ui/components/button";
import Close from "@carbon/icons-react/es/Close";
import Phone from "@carbon/icons-react/es/Phone";
import PhoneOutgoing from "@carbon/icons-react/es/PhoneOutgoing";
import Checkmark from "@carbon/icons-react/es/Checkmark";
import Play from "@carbon/icons-react/es/Play";

interface LiveCallModalProps {
    call: CallRecord;
    onClose: () => void;
}

export function LiveCallModal({ call, onClose }: LiveCallModalProps) {
    const [isVoiceMuted, setIsVoiceMuted] = useState(false);
    const transcriptEndRef = useRef<HTMLDivElement>(null);
    const lastSpokenIndexRef = useRef<number>(-1);

    // Auto-scroll transcript
    useEffect(() => {
        transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [call.transcript]);

    // Live speech preview of AI lines using Web Speech Synthesis
    useEffect(() => {
        if (isVoiceMuted || typeof window === "undefined" || !("speechSynthesis" in window)) return;

        const aiMessages = call.transcript.filter(t => t.speaker === 'AI');
        const latestIdx = aiMessages.length - 1;

        if (latestIdx > lastSpokenIndexRef.current && latestIdx >= 0) {
            const message = aiMessages[latestIdx];
            if (!message) return;
            lastSpokenIndexRef.current = latestIdx;
            const textToSpeak = message.text;
            
            try {
                window.speechSynthesis.cancel();
                const utter = new SpeechSynthesisUtterance(textToSpeak);
                const allVoices = window.speechSynthesis.getVoices();
                const femaleVoice = allVoices.find(v => 
                    v.name.includes("Libby") || 
                    v.name.includes("Natural") || 
                    v.name.includes("Google UK English Female") || 
                    v.lang === "en-GB"
                );
                if (femaleVoice) utter.voice = femaleVoice;
                utter.rate = 1.02;
                utter.pitch = 1.04;
                window.speechSynthesis.speak(utter);
            } catch (e) {}
        }
    }, [call.transcript, isVoiceMuted]);

    // Stop speaking when modal closes
    useEffect(() => {
        return () => {
            if (typeof window !== "undefined" && "speechSynthesis" in window) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    const isConnected = call.status === 'Connected' || call.status === 'Completed';
    const isBooked = call.status === 'Completed' && call.outcome === 'Qualified & Booked';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <div className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-3xl shadow-[0_0_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col h-[700px] max-h-[92vh]">
                
                {/* Header */}
                <div className="bg-white/5 px-6 py-4 border-b border-white/10 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            call.status === 'Ringing' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse' :
                            call.status === 'Connected' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                            'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                        }`}>
                            <PhoneOutgoing className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-base font-bold text-white">{call.receiverName}</h3>
                                <span className="text-xs font-mono text-slate-400">({call.receiverPhone})</span>
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-xs text-slate-400">{call.campaign}</span>
                                <span className="text-slate-600">•</span>
                                <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    {call.status === 'Ringing' ? 'DIALING PROSPECT...' : 
                                     call.status === 'Connected' ? `IN CALL (${call.durationSeconds}s)` : 
                                     `CALL COMPLETE (${call.durationSeconds}s)`}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => {
                                setIsVoiceMuted(!isVoiceMuted);
                                if (!isVoiceMuted && typeof window !== "undefined") window.speechSynthesis.cancel();
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition border ${
                                isVoiceMuted 
                                    ? 'bg-red-500/10 border-red-500/20 text-red-400' 
                                    : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                            }`}
                        >
                            {isVoiceMuted ? 'Audio Muted' : '🔊 Voice Preview ON'}
                        </button>
                        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white" onClick={onClose}>
                            <Close className="w-5 h-5" />
                        </Button>
                    </div>
                </div>

                {/* Sub-header: Qualification Checklist & Telemetry */}
                <div className="bg-black/30 px-6 py-3 border-b border-white/5 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
                    <div className="flex items-center gap-4 text-slate-300">
                        <span className="flex items-center gap-1.5">
                            <span className="text-slate-500">VOICE:</span>
                            <span className="text-teal-300">Fish Audio S2.1-Pro</span>
                        </span>
                        <span>//</span>
                        <span className="flex items-center gap-1.5">
                            <span className="text-slate-500">CARRIER:</span>
                            <span className="text-slate-300">Telnyx Bridge</span>
                        </span>
                        <span>//</span>
                        <span className="flex items-center gap-1.5">
                            <span className="text-slate-500">LATENCY:</span>
                            <span className="text-emerald-400">~620ms</span>
                        </span>
                    </div>

                    {isBooked && (
                        <div className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                            <Checkmark className="w-3.5 h-3.5" />
                            <span>APPOINTMENT BOOKED: {call.bookedSlot}</span>
                        </div>
                    )}
                </div>

                {/* Body: Live Streaming Transcript */}
                <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-950/60 font-sans">
                    {call.transcript.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 space-y-3">
                            <div className="w-12 h-12 rounded-full border-2 border-amber-500/30 border-t-amber-400 animate-spin" />
                            <p className="text-sm font-mono">Ringing {call.receiverPhone} via Telnyx...</p>
                            <p className="text-xs text-slate-600">Fish Audio agent standing by to qualify for $500k+ assets</p>
                        </div>
                    ) : (
                        call.transcript.map((item, idx) => (
                            <div 
                                key={idx} 
                                className={`flex flex-col ${item.speaker === 'AI' ? 'items-start' : 'items-end'}`}
                            >
                                <div className="flex items-center gap-2 mb-1 px-1">
                                    <span className={`text-[11px] font-bold tracking-wider uppercase ${
                                        item.speaker === 'AI' ? 'text-teal-400' : 'text-purple-300'
                                    }`}>
                                        {item.speaker === 'AI' ? 'Sarah (Fish Audio AI)' : call.receiverName}
                                    </span>
                                    <span className="text-[10px] text-slate-500 font-mono">{item.timestamp}</span>
                                </div>
                                
                                <div className={`p-4 rounded-2xl max-w-[85%] text-sm leading-relaxed shadow-lg ${
                                    item.speaker === 'AI' 
                                        ? 'bg-slate-900 border border-teal-500/20 text-slate-100 rounded-tl-sm shadow-[0_4px_20px_rgba(20,184,166,0.08)]' 
                                        : 'bg-purple-950/70 border border-purple-500/30 text-white rounded-tr-sm shadow-[0_4px_20px_rgba(168,85,247,0.15)]'
                                }`}>
                                    {item.text}
                                </div>
                            </div>
                        ))
                    )}
                    <div ref={transcriptEndRef} />
                </div>

                {/* Footer: Live Qualification Card & Action */}
                <div className="bg-white/5 p-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs">
                            <span className="text-slate-500">Assets: </span>
                            <span className="text-emerald-400 font-bold">{call.qualification.investableAssets}</span>
                        </div>
                        <div className="px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs">
                            <span className="text-slate-500">Timeline: </span>
                            <span className="text-slate-200">{call.qualification.timeline}</span>
                        </div>
                        <div className="px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs">
                            <span className="text-slate-500">Fiduciary: </span>
                            <span className="text-amber-400">{call.qualification.hasFiduciary ? 'Yes' : 'None (Open)'}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="bg-white/5 border-white/10 text-slate-300 hover:text-white"
                            onClick={onClose}
                        >
                            {call.status === 'Completed' ? 'Close & Save' : 'Minimize Call'}
                        </Button>
                        
                        {call.status === 'Completed' && (
                            <Button 
                                size="sm" 
                                className="bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold gap-1.5 shadow-lg shadow-emerald-500/20"
                                onClick={onClose}
                            >
                                <Checkmark className="w-4 h-4" />
                                Locked in Calendar
                            </Button>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
