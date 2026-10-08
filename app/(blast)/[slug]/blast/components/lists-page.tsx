"use client";
import { useState, useRef } from "react";
import { Button } from "@crm/ui/components/button";
import Add from "@carbon/icons-react/es/Add";
import Upload from "@carbon/icons-react/es/Upload";
import View from "@carbon/icons-react/es/View";
import Checkmark from "@carbon/icons-react/es/Checkmark";
import * as XLSX from "xlsx";

const MOCK_LISTS = [
    { id: "l1", name: "October CSV Export", group: "Hot Insurance Leads", total: 5000, valid: 4800, invalid: 50, dups: 100, optOuts: 50, sentSoFar: 2000, created: "2026-10-01" },
    { id: "l2", name: "Agent Referrals", group: "Hot Insurance Leads", total: 450, valid: 450, invalid: 0, dups: 0, optOuts: 0, sentSoFar: 450, created: "2026-10-02" },
    { id: "l3", name: "Raw Scraped Data", group: "Cold Roofing Uploads", total: 10000, valid: 8000, invalid: 1500, dups: 400, optOuts: 100, sentSoFar: 0, created: "2026-10-04" },
];

export function ListsPage() {
    const [isAdding, setIsAdding] = useState(false);
    
    // File Upload State
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [rawText, setRawText] = useState("");
    const [fileName, setFileName] = useState("");

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setFileName(file.name);
        const isExcel = file.name.toLowerCase().endsWith(".xlsx") || file.name.toLowerCase().endsWith(".xls");

        if (isExcel) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const data = new Uint8Array(event.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheetName = workbook.SheetNames[0];
                if (firstSheetName) {
                    const worksheet = workbook.Sheets[firstSheetName];
                    if (worksheet) {
                        const csvText = XLSX.utils.sheet_to_csv(worksheet);
                        setRawText(prev => prev ? prev + "\n" + csvText : csvText);
                    }
                }
            };
            reader.readAsArrayBuffer(file);
        } else {
            const reader = new FileReader();
            reader.onload = (event) => {
                const content = event.target?.result as string;
                setRawText(prev => prev ? prev + "\n" + content : content);
            };
            reader.readAsText(file);
        }
    };
    
    if (isAdding) {
        return (
            <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.4)]">
                <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                    <h2 className="text-2xl font-bold text-white">Upload New List</h2>
                    <Button variant="ghost" onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-white hover:bg-white/5">Cancel</Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm text-slate-300 font-medium mb-2 block">List Name</label>
                            <input type="text" className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white" placeholder="e.g. November Promo Segment A" />
                        </div>
                        <div>
                            <label className="text-sm text-slate-300 font-medium mb-2 block">Assign to Group</label>
                            <select className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white">
                                <option className="bg-slate-900 text-white">Hot Insurance Leads</option>
                                <option className="bg-slate-900 text-white">Cold Roofing Uploads</option>
                            </select>
                        </div>
                        <div className="pt-4">
                            <input 
                                type="file" 
                                accept=".csv,.txt,.xlsx,.xls" 
                                className="hidden" 
                                ref={fileInputRef} 
                                onChange={handleFileUpload}
                            />
                            <Button 
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full bg-black/40 border border-white/10 text-white hover:bg-white/10 gap-2 h-24 border-dashed rounded-xl flex flex-col justify-center items-center transition"
                            >
                                {fileName ? (
                                    <>
                                        <Checkmark className="w-6 h-6 mb-2 text-emerald-400" />
                                        <span className="text-emerald-300 font-medium">{fileName} Loaded</span>
                                        <span className="text-xs text-slate-500 font-normal mt-1">Data extracted to text box</span>
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-6 h-6 mb-2 text-teal-400" />
                                        <span>Click to Upload .CSV, .TXT, or Excel</span>
                                        <span className="text-xs text-slate-500 font-normal mt-1">Columns: Phone, First Name (optional)</span>
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                    <div>
                        <label className="text-sm text-slate-300 font-medium mb-2 block">Raw Data (Edit or Paste Manually)</label>
                        <textarea 
                            className="w-full h-[230px] bg-black/40 border border-white/10 rounded-xl p-4 text-white font-mono text-sm focus:outline-none focus:border-teal-500/50"
                            placeholder="+18005550101, John&#10;+18005550102, Sarah"
                            value={rawText}
                            onChange={(e) => setRawText(e.target.value)}
                        />
                    </div>
                </div>

                <div className="bg-teal-900/20 border border-teal-500/30 p-4 rounded-xl flex justify-between items-center">
                    <div>
                        <h4 className="font-semibold text-teal-400 text-sm">Auto-Clean Engine Ready</h4>
                        <p className="text-xs text-teal-200/70 mt-1">When you save, we will instantly format to E.164, strip duplicates, and cross-reference the Global DNC list.</p>
                    </div>
                    <Button disabled={rawText.trim() === ""} className="bg-teal-500 hover:bg-teal-400 text-white px-8 font-bold shadow-[0_0_20px_rgba(20,184,166,0.3)]" onClick={() => setIsAdding(false)}>Clean & Save List</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.4)]">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Contact Lists</h2>
                <Button onClick={() => setIsAdding(true)} className="bg-purple-600 hover:bg-purple-500 text-white gap-2"><Add className="w-4 h-4" /> Add List</Button>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                    <thead className="text-xs uppercase bg-purple-900/30 text-purple-200/80 border-b border-purple-500/20">
                        <tr>
                            <th className="px-4 py-3 font-medium">List Name</th>
                            <th className="px-4 py-3 font-medium">Group</th>
                            <th className="px-4 py-3 font-medium">Clean & Verify Results</th>
                            <th className="px-4 py-3 font-medium text-right">Sent / Total</th>
                            <th className="px-4 py-3 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {MOCK_LISTS.map(l => (
                            <tr key={l.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-4 py-4">
                                    <div className="font-medium text-white">{l.name}</div>
                                    <div className="text-xs text-slate-500 mt-1">{l.created}</div>
                                </td>
                                <td className="px-4 py-4 text-slate-400">{l.group}</td>
                                <td className="px-4 py-4">
                                    <div className="flex gap-3 text-xs">
                                        <div className="text-emerald-400 font-mono bg-emerald-500/10 px-2 py-1 rounded">{l.valid} Valid</div>
                                        {l.invalid > 0 && <div className="text-red-400 font-mono bg-red-500/10 px-2 py-1 rounded">{l.invalid} Junk</div>}
                                        {l.dups > 0 && <div className="text-slate-400 font-mono bg-white/5 px-2 py-1 rounded">{l.dups} Dups</div>}
                                        {l.optOuts > 0 && <div className="text-amber-400 font-mono bg-amber-500/10 px-2 py-1 rounded">{l.optOuts} DNC</div>}
                                    </div>
                                </td>
                                <td className="px-4 py-4 text-right">
                                    <div className="font-mono text-teal-400 font-bold">{l.sentSoFar.toLocaleString()} <span className="text-slate-500 text-xs font-sans font-normal">/ {l.valid.toLocaleString()}</span></div>
                                </td>
                                <td className="px-4 py-4 text-right">
                                    <Button size="sm" variant="ghost" className="h-7 px-2 text-slate-400 hover:text-white hover:bg-white/10 text-xs"><View className="w-4 h-4 mr-1" /> View Data</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
