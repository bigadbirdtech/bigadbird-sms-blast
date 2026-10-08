"use client";
import { Button } from "@crm/ui/components/button";

export function LiveProgress({ stats, onStop, total }: any) {
    if (!stats) return <div className="text-white p-10 text-center animate-pulse">Initializing Blast Engine...</div>;

    const percent = Math.round((stats.sent / total) * 100);

    return (
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-[2rem] p-10 backdrop-blur-[40px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                        <span className="relative flex h-4 w-4">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-4 w-4 bg-teal-500"></span>
                        </span>
                        Campaign Live
                    </h2>
                    <p className="text-slate-400 mt-1">Sending messages to {total} recipients</p>
                </div>
                <Button variant="ghost" onClick={onStop} className="text-red-400 hover:text-red-300 hover:bg-red-400/10">Stop Campaign</Button>
            </div>

            <div className="w-full bg-black/40 rounded-full h-6 mb-8 border border-white/5 overflow-hidden p-1">
                <div className="bg-gradient-to-r from-teal-600 to-teal-400 h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${percent}%` }}></div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
                    <div className="text-4xl font-bold text-white mb-1">{stats.sent}</div>
                    <div className="text-sm text-slate-400 uppercase tracking-wider">Sent</div>
                </div>
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 text-center">
                    <div className="text-4xl font-bold text-emerald-400 mb-1">{stats.delivered}</div>
                    <div className="text-sm text-emerald-400/70 uppercase tracking-wider">Delivered</div>
                </div>
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6 text-center">
                    <div className="text-4xl font-bold text-amber-400 mb-1">{stats.replied}</div>
                    <div className="text-sm text-amber-400/70 uppercase tracking-wider">Replied</div>
                </div>
                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center">
                    <div className="text-4xl font-bold text-red-400 mb-1">{stats.failed}</div>
                    <div className="text-sm text-red-400/70 uppercase tracking-wider">Failed</div>
                </div>
            </div>

            <div className="bg-black/20 rounded-2xl p-6 border border-white/5">
                <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Live Logs</h3>
                <div className="space-y-2 font-mono text-xs">
                    <div className="text-emerald-400">[SYSTEM] Blast engine started. Allocating numbers...</div>
                    <div className="text-teal-400">[SEND] Batch queued successfully ({stats.sent} total).</div>
                    {stats.failed > 0 && <div className="text-amber-400">[WARN] Delivery failure reported by carrier.</div>}
                </div>
            </div>
        </div>
    );
}

