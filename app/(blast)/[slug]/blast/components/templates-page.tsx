"use client";
import { useState } from "react";
import { Button } from "@crm/ui/components/button";
import Add from "@carbon/icons-react/es/Add";
import Folder from "@carbon/icons-react/es/Folder";
import Edit from "@carbon/icons-react/es/Edit";
import TrashCan from "@carbon/icons-react/es/TrashCan";
import Copy from "@carbon/icons-react/es/Copy";

const MOCK_FOLDERS = ["Insurance - Discount", "Insurance - Price Explained", "Insurance - Regular", "Retirement", "Roofing Promo"];
const MOCK_TEMPLATES = [
    { id: "t1", text: "Hi {first_name}, I wanted to quickly follow up regarding the insurance quote you requested. Let me know if you're still interested!", chars: 133, sent: 4500, replyRate: "4.2%", stopRate: "0.8%", active: true },
    { id: "t2", text: "Hey {first_name}, just touching base on your policy options. We have a new 20% discount available this week. Reply YES to claim.", chars: 128, sent: 8200, replyRate: "6.1%", stopRate: "1.2%", active: true },
    { id: "t3", text: "Are you still looking for roofing services? We have an inspector in your area tomorrow. Reply FREE for a free inspection.", chars: 122, sent: 1200, replyRate: "2.4%", stopRate: "3.5%", active: false },
];

export function TemplatesPage() {
    const [selectedFolder, setSelectedFolder] = useState(MOCK_FOLDERS[0]);
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [draftText, setDraftText] = useState("");

    const handleEdit = (text: string) => {
        setDraftText(text);
        setIsEditing("edit");
    };

    if (isEditing) {
        const charCount = draftText.length;
        const isOver = charCount > 160;
        const segments = Math.ceil(charCount / 160) || 1;
        const hasRiskyWords = draftText.toLowerCase().includes("free") || draftText.toUpperCase() === draftText;

        return (
            <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.4)]">
                <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                    <h2 className="text-2xl font-bold text-white">Create / Edit Template</h2>
                    <Button variant="ghost" onClick={() => setIsEditing(null)} className="text-slate-400 hover:text-white hover:bg-white/5">Cancel</Button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                        <label className="text-sm text-slate-300 font-medium mb-2 block">Message Content</label>
                        <textarea 
                            className={`w-full h-48 bg-black/40 border rounded-xl p-4 text-white font-mono text-sm focus:outline-none ${isOver ? 'border-red-500/50' : 'border-white/10 focus:border-purple-500/50'}`}
                            value={draftText}
                            onChange={e => setDraftText(e.target.value)}
                            placeholder="Type message here. Use {first_name} for merge fields."
                        />
                        <div className="flex justify-between items-center mt-2">
                            <div className="flex gap-2">
                                <Button size="sm" variant="outline" className="h-7 text-xs bg-white/5 border-white/10 text-white" onClick={() => setDraftText(draftText + "{first_name}")}>{`{first_name}`}</Button>
                                <Button size="sm" variant="outline" className="h-7 text-xs bg-white/5 border-white/10 text-white" onClick={() => setDraftText(draftText + "{agent_name}")}>{`{agent_name}`}</Button>
                            </div>
                            <div className={`text-sm font-bold ${isOver ? 'text-red-400' : 'text-slate-400'}`}>
                                {charCount} / 160 <span className="font-normal text-xs ml-1">(Segments: {segments})</span>
                            </div>
                        </div>
                        
                        {isOver && <div className="mt-2 text-xs text-red-400 bg-red-500/10 p-2 rounded border border-red-500/20">Over 160 characters: This will incur extra cost per message.</div>}
                        {hasRiskyWords && <div className="mt-2 text-xs text-amber-400 bg-amber-500/10 p-2 rounded border border-amber-500/20">Warning: Contains risky spam words ("free" or ALL CAPS). May increase block rate.</div>}

                        <Button className="mt-8 bg-purple-600 hover:bg-purple-500 text-white px-8" onClick={() => setIsEditing(null)}>Save Template</Button>
                    </div>

                    <div className="bg-black/20 border border-white/5 p-6 rounded-2xl">
                        <h4 className="text-sm font-medium text-slate-400 mb-4 uppercase tracking-wider">Preview</h4>
                        <div className="flex justify-end">
                            <div className="bg-teal-600 text-white p-3 rounded-2xl rounded-br-sm max-w-[80%] text-sm shadow-md">
                                {draftText.replace("{first_name}", "John").replace("{agent_name}", "Sarah") || "Message preview will appear here..."}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Left Folders Column */}
            <div className="md:col-span-1 bg-white/[0.03] border border-white/10 rounded-3xl p-6 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] h-fit">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-semibold text-white">Folders</h3>
                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-slate-400 hover:text-white hover:bg-white/10"><Add className="w-4 h-4" /></Button>
                </div>
                <div className="space-y-1">
                    {MOCK_FOLDERS.map(f => (
                        <button 
                            key={f}
                            onClick={() => setSelectedFolder(f)}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-3 transition ${selectedFolder === f ? 'bg-purple-600/30 text-purple-200 border border-purple-500/30' : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'}`}
                        >
                            <Folder className={`w-4 h-4 ${selectedFolder === f ? 'text-purple-300' : ''}`} /> {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Right Templates Column */}
            <div className="md:col-span-3 bg-white/[0.03] border border-white/10 rounded-3xl p-6 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.4)]">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white">{selectedFolder}</h2>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="bg-white/5 border-white/10 text-white hover:bg-white/10">Bulk Import</Button>
                        <Button size="sm" className="bg-purple-600 hover:bg-purple-500 text-white gap-2" onClick={() => handleEdit("")}><Add className="w-4 h-4" /> New Template</Button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-300">
                        <thead className="text-xs uppercase bg-purple-900/30 text-purple-200/80 border-b border-purple-500/20">
                            <tr>
                                <th className="px-4 py-3 font-medium w-1/2">Message Text</th>
                                <th className="px-4 py-3 font-medium">Performance</th>
                                <th className="px-4 py-3 font-medium">Active</th>
                                <th className="px-4 py-3 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {MOCK_TEMPLATES.map(t => (
                                <tr key={t.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-4 py-4">
                                        <div className="text-white font-mono text-xs mb-1 line-clamp-2">{t.text}</div>
                                        <div className="text-[10px] text-slate-500 uppercase">{t.chars} Chars • {Math.ceil(t.chars/160)} Segment</div>
                                    </td>
                                    <td className="px-4 py-4 text-xs">
                                        <div className="text-slate-300">Sent: {t.sent.toLocaleString()}</div>
                                        <div className="text-emerald-400">Reply: {t.replyRate}</div>
                                        <div className={parseFloat(t.stopRate) > 3 ? "text-red-400 font-bold" : "text-slate-400"}>STOP: {t.stopRate}</div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" defaultChecked={t.active} />
                                            <div className="w-9 h-5 bg-black/40 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600 border border-white/10"></div>
                                        </label>
                                    </td>
                                    <td className="px-4 py-4 text-right">
                                        <div className="flex justify-end gap-1">
                                            <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-slate-400 hover:text-white hover:bg-white/10" onClick={() => handleEdit(t.text)}><Edit className="w-4 h-4" /></Button>
                                            <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-slate-400 hover:text-white hover:bg-white/10"><Copy className="w-4 h-4" /></Button>
                                            <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-red-400 hover:bg-red-400/20"><TrashCan className="w-4 h-4" /></Button>
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
