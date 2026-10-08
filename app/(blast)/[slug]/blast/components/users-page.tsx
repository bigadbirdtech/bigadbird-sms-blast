"use client";
import { useState } from "react";
import { Button } from "@crm/ui/components/button";
import Add from "@carbon/icons-react/es/Add";
import Edit from "@carbon/icons-react/es/Edit";
import Email from "@carbon/icons-react/es/Email";

const MOCK_USERS = [
    { id: "u1", name: "Admin (You)", email: "admin@company.com", role: "Admin", assigned: "All Numbers", blastAccess: true, crmAccess: true, status: "Active" },
    { id: "u2", name: "Sarah Jenkins", email: "sarah@company.com", role: "Agent", assigned: "+18005550101", blastAccess: true, crmAccess: false, status: "Active" },
    { id: "u3", name: "Mike Davis", email: "mike@company.com", role: "Agent", assigned: "None", blastAccess: false, crmAccess: true, status: "Active" },
];

export function UsersPage() {
    const [isInviting, setIsInviting] = useState(false);

    if (isInviting) {
        return (
            <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] max-w-2xl mx-auto">
                <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Email className="text-purple-400 w-6 h-6" /> Whitelist New Employee
                    </h2>
                    <Button variant="ghost" onClick={() => setIsInviting(false)} className="text-slate-400 hover:text-white hover:bg-white/5">Cancel</Button>
                </div>
                
                <div className="space-y-6">
                    <div>
                        <label className="text-sm text-slate-300 font-medium mb-2 block">Employee Email Address</label>
                        <input type="email" className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-purple-500/50 focus:outline-none" placeholder="agent@yourcompany.com" autoFocus />
                        <p className="text-xs text-slate-500 mt-2">This email will be allowed to log into the system.</p>
                    </div>

                    <div className="bg-black/20 border border-white/5 p-6 rounded-xl space-y-4">
                        <h3 className="font-bold text-white mb-2">Module Access Grants</h3>
                        
                        <label className="flex items-center gap-4 p-3 border border-white/10 rounded-lg cursor-pointer hover:bg-white/5 transition">
                            <input type="checkbox" className="accent-teal-500 w-5 h-5" defaultChecked />
                            <div>
                                <div className="font-bold text-teal-400">Blast SMS System</div>
                                <div className="text-xs text-slate-400">Can access the SMS module and send text campaigns.</div>
                            </div>
                        </label>

                        <label className="flex items-center gap-4 p-3 border border-white/10 rounded-lg cursor-pointer hover:bg-white/5 transition">
                            <input type="checkbox" className="accent-purple-500 w-5 h-5" />
                            <div>
                                <div className="font-bold text-purple-400">CRM Core</div>
                                <div className="text-xs text-slate-400">Can view pipelines, deals, and customer data.</div>
                            </div>
                        </label>
                    </div>
                    
                    <div className="flex justify-end pt-4">
                        <Button className="bg-purple-600 hover:bg-purple-500 text-white px-8 font-bold shadow-[0_0_20px_rgba(147,51,234,0.3)]" onClick={() => setIsInviting(false)}>Send Access Invitation</Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.4)]">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-bold text-white">Access Control & Whitelisting</h2>
                    <p className="text-sm text-slate-400 mt-1">Control exactly which emails can log into the CRM vs the SMS system.</p>
                </div>
                <Button onClick={() => setIsInviting(true)} className="bg-purple-600 hover:bg-purple-500 text-white gap-2"><Add className="w-4 h-4" /> Whitelist Employee</Button>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                    <thead className="text-xs uppercase bg-purple-900/30 text-purple-200/80 border-b border-purple-500/20">
                        <tr>
                            <th className="px-4 py-3 font-medium">User Email</th>
                            <th className="px-4 py-3 font-medium text-center">Blast SMS Access</th>
                            <th className="px-4 py-3 font-medium text-center">CRM Core Access</th>
                            <th className="px-4 py-3 font-medium text-center">Status</th>
                            <th className="px-4 py-3 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {MOCK_USERS.map(u => (
                            <tr key={u.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-4 py-4">
                                    <div className="font-medium text-white">{u.name}</div>
                                    <div className="text-xs text-slate-400 mt-1">{u.email}</div>
                                </td>
                                <td className="px-4 py-4 text-center">
                                    {u.blastAccess ? <span className="bg-teal-500/20 text-teal-400 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider border border-teal-500/30">Granted</span> : <span className="bg-slate-500/20 text-slate-400 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">Denied</span>}
                                </td>
                                <td className="px-4 py-4 text-center">
                                    {u.crmAccess ? <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider border border-purple-500/30">Granted</span> : <span className="bg-slate-500/20 text-slate-400 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">Denied</span>}
                                </td>
                                <td className="px-4 py-4 text-center">
                                    <span className={u.status === 'Active' ? 'text-emerald-400' : 'text-slate-500'}>{u.status}</span>
                                </td>
                                <td className="px-4 py-4 text-right">
                                    <Button size="sm" variant="ghost" className="h-7 px-2 text-slate-400 hover:text-white hover:bg-white/10 text-xs"><Edit className="w-3 h-3 mr-1" /> Edit Access</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            <div className="mt-6 bg-black/20 border border-white/5 p-4 rounded-xl text-sm text-slate-400">
                <strong className="text-white">Security Note:</strong> If an email is not explicitly whitelisted and granted module access here, they will be completely blocked at the authentication gates of both the HQ and individual modules.
            </div>
        </div>
    );
}
