"use client";
import { useState, useEffect } from "react";
import { api, Campaign } from "../lib/api";
import { Button } from "@crm/ui/components/button";
import Play from "@carbon/icons-react/es/Play";
import Pause from "@carbon/icons-react/es/Pause";
import Stop from "@carbon/icons-react/es/Stop";
import Copy from "@carbon/icons-react/es/Copy";
import Add from "@carbon/icons-react/es/Add";
import Checkmark from "@carbon/icons-react/es/Checkmark";
import { LiveProgress } from "./live-progress";

export function CampaignsPage() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const [isRunning, setIsRunning] = useState(false);
    const [stats, setStats] = useState<any>(null);
    
    // New Campaign Form State
    const [name, setName] = useState("");
    const [group, setGroup] = useState("");
    const [templates, setTemplates] = useState<string[]>([]);
    const [numbers, setNumbers] = useState<string[]>([]);
    const [speed, setSpeed] = useState(15);

    useEffect(() => {
        api.getCampaigns().then(setCampaigns);
    }, []);

    const handleStart = () => {
        setIsRunning(true);
        api.sendBatch({ recipients: 1000 }, (newStats) => {
            setStats(newStats);
        });
    };

    if (isRunning) {
        return (
            <div className="space-y-6">
                <LiveProgress stats={stats} onStop={() => { setIsRunning(false); setIsCreating(false); }} total={1000} />
            </div>
        );
    }

    if (isCreating) {
        return (
            <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.4)]">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-white">New Campaign</h2>
                    <Button variant="ghost" onClick={() => setIsCreating(false)} className="text-slate-400 hover:text-white hover:bg-white/5">Cancel</Button>
                </div>
                
                <div className="space-y-10">
                    <section>
                        <h3 className="text-lg font-semibold text-white mb-4 border-b border-white/10 pb-2">1. Basics</h3>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="text-sm text-slate-400 mb-1 block">Campaign Name</label>
                                <input type="text" className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white" value={name} onChange={e => setName(e.target.value)} />
                            </div>
                            <div>
                                <label className="text-sm text-slate-400 mb-1 block">Recipient Group</label>
                                <select className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white" value={group} onChange={e => setGroup(e.target.value)}>
                                    <option className="bg-slate-900 text-white" value="">Select Group...</option>
                                    <option className="bg-slate-900 text-white" value="Hot Leads">Hot Leads (10,000 contacts)</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-lg font-semibold text-white mb-4 border-b border-white/10 pb-2">2. Templates & Numbers</h3>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="bg-black/20 border border-white/5 p-4 rounded-xl">
                                <h4 className="font-medium text-white mb-2">Select Templates</h4>
                                <label className="flex items-center gap-2 text-slate-300 text-sm cursor-pointer mb-2"><input type="checkbox" onChange={e => setTemplates(e.target.checked ? ['t1'] : [])} checked={templates.length > 0} className="accent-teal-500" /> Retirement Follow-up</label>
                                <div className="mt-4 text-xs text-slate-500">Rotation: Switch every 100 recipients</div>
                            </div>
                            <div className="bg-black/20 border border-white/5 p-4 rounded-xl">
                                <h4 className="font-medium text-white mb-2">Select Sender Numbers</h4>
                                <label className="flex items-center gap-2 text-slate-300 text-sm cursor-pointer mb-2"><input type="checkbox" onChange={e => setNumbers(e.target.checked ? ['n1'] : [])} checked={numbers.length > 0} className="accent-teal-500" /> +18005550101 <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-1 rounded uppercase">Healthy</span></label>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-lg font-semibold text-white mb-4 border-b border-white/10 pb-2">3. Advanced Settings</h3>
                        <div className="grid grid-cols-2 gap-6 bg-black/20 border border-white/5 p-6 rounded-xl">
                            <div>
                                <label className="text-sm text-slate-300 block mb-2">Delay between messages</label>
                                <div className="flex items-center gap-2 text-sm text-slate-400">
                                    Min <input type="number" className="w-16 bg-black/40 border border-white/10 rounded px-2 py-1 text-white" defaultValue={5} /> 
                                    Max <input type="number" className="w-16 bg-black/40 border border-white/10 rounded px-2 py-1 text-white" defaultValue={15} /> seconds
                                </div>
                            </div>
                            <div>
                                <label className="flex items-center gap-2 text-slate-300 text-sm cursor-pointer mb-2"><input type="checkbox" className="accent-teal-500" defaultChecked /> Enforce Quiet Hours (9 AM - 8 PM)</label>
                                <label className="flex items-center gap-2 text-slate-300 text-sm cursor-pointer"><input type="checkbox" className="accent-teal-500" /> Test Mode (Send to my number only)</label>
                            </div>
                        </div>
                    </section>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center">
                    <div className="text-sm text-slate-400">Live Estimate: <span className="text-white font-medium">1,000 messages, ~ 2h 47m</span></div>
                    <Button onClick={handleStart} className="bg-teal-500 hover:bg-teal-400 text-white font-bold px-8 shadow-[0_0_20px_rgba(20,184,166,0.3)]">START CAMPAIGN</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.4)]">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Campaigns</h2>
                <Button onClick={() => setIsCreating(true)} className="bg-teal-500 hover:bg-teal-400 text-white gap-2"><Add className="w-4 h-4" /> New Campaign</Button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                    <thead className="text-xs uppercase bg-purple-900/30 text-purple-200/80 border-b border-purple-500/20">
                        <tr>
                            <th className="px-4 py-3 font-medium">Name</th>
                            <th className="px-4 py-3 font-medium">Group</th>
                            <th className="px-4 py-3 font-medium">Status</th>
                            <th className="px-4 py-3 font-medium text-right">Progress</th>
                            <th className="px-4 py-3 font-medium">Stats</th>
                            <th className="px-4 py-3 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {campaigns.map(c => (
                            <tr key={c.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-4 py-4 font-medium text-white">{c.name}<div className="text-xs text-slate-500 font-normal mt-0.5">{c.created}</div></td>
                                <td className="px-4 py-4">{c.group}</td>
                                <td className="px-4 py-4">
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                        c.status === 'Running' ? 'bg-teal-500/20 text-teal-400' :
                                        c.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400' :
                                        'bg-slate-500/20 text-slate-400'
                                    }`}>
                                        {c.status}
                                    </span>
                                </td>
                                <td className="px-4 py-4 text-right">
                                    <div className="text-xs mb-1 text-slate-400">{c.sent.toLocaleString()} / {c.total.toLocaleString()}</div>
                                    <div className="w-32 ml-auto bg-black/40 h-2 rounded-full overflow-hidden border border-white/5">
                                        <div className={`h-full rounded-full ${c.status === 'Running' ? 'bg-teal-500' : 'bg-emerald-500'}`} style={{ width: `${(c.sent / c.total) * 100}%` }}></div>
                                    </div>
                                </td>
                                <td className="px-4 py-4 text-xs">
                                    <span className="text-emerald-400 block">{c.delivered} Dlv</span>
                                    <span className="text-purple-400 block">{c.replies} Rep</span>
                                </td>
                                <td className="px-4 py-4 text-right">
                                    <div className="flex justify-end gap-1">
                                        {c.status === 'Running' ? (
                                            <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-amber-400 hover:bg-amber-400/20"><Pause className="w-4 h-4" /></Button>
                                        ) : (
                                            <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-teal-400 hover:bg-teal-400/20"><Play className="w-4 h-4" /></Button>
                                        )}
                                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-red-400 hover:bg-red-400/20"><Stop className="w-4 h-4" /></Button>
                                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-slate-400 hover:bg-white/10"><Copy className="w-4 h-4" /></Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
