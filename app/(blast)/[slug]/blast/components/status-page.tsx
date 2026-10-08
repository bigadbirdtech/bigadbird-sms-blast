"use client";
import { useState } from "react";
import { Button } from "@crm/ui/components/button";
import Add from "@carbon/icons-react/es/Add";
import WarningAlt from "@carbon/icons-react/es/WarningAlt";
import ErrorIcon from "@carbon/icons-react/es/Error";
import CloudApp from "@carbon/icons-react/es/CloudApp";

const MOCK_NUMBERS = [
    { id: "n1", phone: "+18005550101", label: "Main Sales A", assigned: "Sarah J.", sent: 950, limit: 1000, acceptance: "99.2%", spam: "0.1%", stop: "1.2%", reg: "A2P 10DLC Verified", health: "Healthy", active: true },
    { id: "n2", phone: "+18005550102", label: "Promo Blast 1", assigned: "Shared (All)", sent: 1000, limit: 1000, acceptance: "94.0%", spam: "3.5%", stop: "4.1%", reg: "A2P 10DLC Verified", health: "Warning", active: true },
    { id: "n3", phone: "+18005550103", label: "Cold Outreach", assigned: "Mike D.", sent: 420, limit: 1000, acceptance: "82.5%", spam: "8.9%", stop: "12.4%", reg: "Unregistered", health: "Flagged", active: false },
];

const MOCK_ALERTS = [
    { id: 1, type: "error", message: "Number +18005550103 flagged by carrier for high spam rate (8.9%). Number automatically paused.", time: "10 mins ago" },
    { id: 2, type: "warning", message: "Campaign 'Summer Promo Blast' template 't2' is generating a high STOP rate (4.1%). Consider rotating.", time: "2 hours ago" },
];

export function StatusPage() {
    const [isAdding, setIsAdding] = useState(false);

    if (isAdding) {
        return (
            <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] max-w-2xl mx-auto">
                <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <CloudApp className="text-teal-400 w-6 h-6" /> Connect Telnyx Number
                    </h2>
                    <Button variant="ghost" onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-white hover:bg-white/5">Cancel</Button>
                </div>
                
                <div className="space-y-6">
                    <div>
                        <label className="text-sm text-slate-300 font-medium mb-2 block">Phone Number</label>
                        <input type="text" className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white font-mono focus:border-purple-500/50 focus:outline-none" placeholder="+1234567890" autoFocus />
                    </div>
                    <div>
                        <label className="text-sm text-slate-300 font-medium mb-2 block">Internal Label</label>
                        <input type="text" className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-purple-500/50 focus:outline-none" placeholder="e.g. November Retargeting Number" />
                    </div>
                    <div>
                        <label className="text-sm text-slate-300 font-medium mb-2 block">Daily Send Limit (Safety Cap)</label>
                        <input type="number" className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white font-mono focus:border-purple-500/50 focus:outline-none" defaultValue={1000} />
                    </div>
                    
                    <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl flex gap-3 mt-4">
                        <WarningAlt className="text-amber-400 shrink-0 mt-0.5" />
                        <div>
                            <h4 className="text-sm font-semibold text-amber-400 mb-1">A2P 10DLC Registration Required</h4>
                            <p className="text-xs text-amber-200/70">Before you can send high-volume traffic, this number must be registered for 10DLC with Telnyx. Unregistered numbers will have a heavily restricted throughput.</p>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button className="bg-purple-600 hover:bg-purple-500 text-white px-8 font-bold shadow-[0_0_20px_rgba(147,51,234,0.3)]" onClick={() => setIsAdding(false)}>Save & Connect Number</Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Section C: Alerts */}
            {MOCK_ALERTS.length > 0 && (
                <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.4)]">
                    <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><WarningAlt className="text-amber-400" /> System Alerts</h2>
                    <div className="space-y-3">
                        {MOCK_ALERTS.map(a => (
                            <div key={a.id} className={`p-4 rounded-xl border flex gap-3 ${a.type === 'error' ? 'bg-red-500/10 border-red-500/20' : 'bg-amber-500/10 border-amber-500/20'}`}>
                                {a.type === 'error' ? <ErrorIcon className="text-red-400 shrink-0 mt-0.5" /> : <WarningAlt className="text-amber-400 shrink-0 mt-0.5" />}
                                <div>
                                    <div className={a.type === 'error' ? "text-red-200" : "text-amber-200"}>{a.message}</div>
                                    <div className="text-xs mt-1 opacity-70">{a.time}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Section A: Numbers Health */}
            <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.4)]">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-white">Sending Numbers (Telnyx)</h2>
                        <p className="text-sm text-slate-400 mt-1">Carrier health, delivery rates, and registration status.</p>
                    </div>
                    <Button onClick={() => setIsAdding(true)} className="bg-purple-600 hover:bg-purple-500 text-white gap-2"><Add className="w-4 h-4" /> Add Telnyx Number</Button>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-300">
                        <thead className="text-xs uppercase bg-purple-900/30 text-purple-200/80 border-b border-purple-500/20">
                            <tr>
                                <th className="px-4 py-3 font-medium">Number & Label</th>
                                <th className="px-4 py-3 font-medium">Assigned</th>
                                <th className="px-4 py-3 font-medium">Registration</th>
                                <th className="px-4 py-3 font-medium">Health Metrics</th>
                                <th className="px-4 py-3 font-medium text-right">Sent Today</th>
                                <th className="px-4 py-3 font-medium text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {MOCK_NUMBERS.map(n => (
                                <tr key={n.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-4 py-4">
                                        <div className="font-mono text-white font-bold">{n.phone}</div>
                                        <div className="text-xs text-slate-400 mt-1">{n.label}</div>
                                    </td>
                                    <td className="px-4 py-4 text-slate-300">{n.assigned}</td>
                                    <td className="px-4 py-4">
                                        <span className={`text-xs px-2 py-1 rounded border ${n.reg.includes("Verified") ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>{n.reg}</span>
                                    </td>
                                    <td className="px-4 py-4 text-xs">
                                        <div className="flex gap-4">
                                            <div>
                                                <div className="text-slate-500 mb-1">Delivered</div>
                                                <div className="text-emerald-400 font-mono">{n.acceptance}</div>
                                            </div>
                                            <div>
                                                <div className="text-slate-500 mb-1">Spam Block</div>
                                                <div className={parseFloat(n.spam) > 2 ? "text-red-400 font-mono font-bold" : "text-amber-400 font-mono"}>{n.spam}</div>
                                            </div>
                                            <div>
                                                <div className="text-slate-500 mb-1">STOP Rate</div>
                                                <div className={parseFloat(n.stop) > 3 ? "text-red-400 font-mono font-bold" : "text-slate-300 font-mono"}>{n.stop}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-right">
                                        <div className="font-mono text-white">{n.sent} <span className="text-slate-500 text-xs font-sans">/ {n.limit}</span></div>
                                        <div className="w-full bg-black/40 h-1.5 mt-2 rounded-full overflow-hidden">
                                            <div className={`h-full rounded-full ${n.sent >= n.limit ? 'bg-red-500' : 'bg-teal-500'}`} style={{ width: `${(n.sent / n.limit) * 100}%` }}></div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider ${n.health === 'Healthy' ? 'bg-emerald-500/20 text-emerald-400' : n.health === 'Warning' ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'}`}>
                                                {n.health}
                                            </span>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" className="sr-only peer" defaultChecked={n.active} />
                                                <div className="w-7 h-4 bg-black/40 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-teal-500 border border-white/10"></div>
                                            </label>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
