"use client";
import { useState } from "react";
import { Button } from "@crm/ui/components/button";
import Add from "@carbon/icons-react/es/Add";
import Edit from "@carbon/icons-react/es/Edit";
import TrashCan from "@carbon/icons-react/es/TrashCan";

const MOCK_GROUPS = [
    { id: "g1", name: "Hot Insurance Leads", lists: 3, contacts: 10450, created: "2026-09-15" },
    { id: "g2", name: "Cold Roofing Uploads", lists: 1, contacts: 4200, created: "2026-10-01" },
    { id: "g3", name: "Past Clients (DNC Exempt)", lists: 5, contacts: 1200, created: "2026-10-03" },
];

export function GroupsPage() {
    const [isAdding, setIsAdding] = useState(false);
    
    if (isAdding) {
        return (
            <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] max-w-2xl mx-auto">
                <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                    <h2 className="text-2xl font-bold text-white">Create New Group</h2>
                    <Button variant="ghost" onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-white hover:bg-white/5">Cancel</Button>
                </div>
                
                <div className="space-y-6">
                    <div>
                        <label className="text-sm text-slate-300 font-medium mb-2 block">Group Name</label>
                        <input type="text" className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-purple-500/50 focus:outline-none" placeholder="e.g. November Retargeting" autoFocus />
                        <p className="text-xs text-slate-500 mt-2">Groups are used to organize multiple contact lists together for larger blasts.</p>
                    </div>
                    
                    <div className="flex justify-end pt-4">
                        <Button className="bg-purple-600 hover:bg-purple-500 text-white px-8 font-bold shadow-[0_0_20px_rgba(147,51,234,0.3)]" onClick={() => setIsAdding(false)}>Save Group</Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.4)]">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Contact Groups</h2>
                <Button onClick={() => setIsAdding(true)} className="bg-purple-600 hover:bg-purple-500 text-white gap-2"><Add className="w-4 h-4" /> Create Group</Button>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                    <thead className="text-xs uppercase bg-purple-900/30 text-purple-200/80 border-b border-purple-500/20">
                        <tr>
                            <th className="px-4 py-3 font-medium">Group Name</th>
                            <th className="px-4 py-3 font-medium text-center">Lists Inside</th>
                            <th className="px-4 py-3 font-medium text-center">Total Contacts</th>
                            <th className="px-4 py-3 font-medium">Created Date</th>
                            <th className="px-4 py-3 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {MOCK_GROUPS.map(g => (
                            <tr key={g.id} className="hover:bg-white/5 transition-colors cursor-pointer">
                                <td className="px-4 py-4 font-medium text-white text-base">{g.name}</td>
                                <td className="px-4 py-4 text-center">
                                    <span className="bg-white/10 text-slate-300 px-3 py-1 rounded-full text-xs font-bold">{g.lists}</span>
                                </td>
                                <td className="px-4 py-4 text-center text-teal-400 font-mono font-bold">
                                    {g.contacts.toLocaleString()}
                                </td>
                                <td className="px-4 py-4 text-slate-400">{g.created}</td>
                                <td className="px-4 py-4 text-right">
                                    <div className="flex justify-end gap-1" onClick={e => e.stopPropagation()}>
                                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-slate-400 hover:text-white hover:bg-white/10"><Edit className="w-4 h-4" /></Button>
                                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-red-400 hover:bg-red-400/20"><TrashCan className="w-4 h-4" /></Button>
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
