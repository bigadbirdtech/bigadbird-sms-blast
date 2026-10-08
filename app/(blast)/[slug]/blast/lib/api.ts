// Mock API Layer for Telnyx SMS Blast System
// All future backend calls to Telnyx and the Database should be wired here.

export type Conversation = {
    id: string;
    receiverName: string;
    receiverPhone: string;
    senderPhone: string;
    note: string;
    status: 'Waiting' | 'Yes' | 'STOP';
    date: string;
    campaign: string;
};

export type Campaign = {
    id: string;
    name: string;
    group: string;
    status: 'Running' | 'Paused' | 'Completed' | 'Draft';
    sent: number;
    total: number;
    delivered: number;
    replies: number;
    stops: number;
    created: string;
};

// --- MOCK DATA ---

const MOCK_CONVERSATIONS: Conversation[] = Array.from({length: 200}).map((_, i) => {
    const isStop = i % 15 === 0;
    const isYes = i % 8 === 0 && !isStop;
    return {
        id: `conv-${i}`,
        receiverName: `Lead ${i}`,
        receiverPhone: `+1800555${(1000 + i).toString().padStart(4, '0')}`,
        senderPhone: `+1800555010${(i % 5) + 1}`,
        note: isStop ? "STOP" : isYes ? "Send me more info" : "...",
        status: isStop ? 'STOP' : isYes ? 'Yes' : 'Waiting',
        date: new Date(Date.now() - Math.random() * 1000000000).toISOString().slice(0, 10),
        campaign: i % 2 === 0 ? "17 - Insurance Agents" : "21 - Roofing Agents"
    };
});

const MOCK_CAMPAIGNS: Campaign[] = [
    { id: "c1", name: "Summer Promo Blast", group: "Hot Insurance", status: "Completed", sent: 10000, total: 10000, delivered: 9400, replies: 120, stops: 45, created: "2026-10-01" },
    { id: "c2", name: "Retirement Follow-up", group: "Cold Leads", status: "Running", sent: 450, total: 5000, delivered: 440, replies: 5, stops: 2, created: "2026-10-04" },
];

// --- SERVICE FUNCTIONS ---

export const api = {
    // [TELNYX HOOK] Fetch inbound SMS replies and conversation threads
    getConversations: async (): Promise<Conversation[]> => {
        return new Promise(resolve => setTimeout(() => resolve(MOCK_CONVERSATIONS), 300));
    },

    // [DB HOOK] Fetch campaigns
    getCampaigns: async (): Promise<Campaign[]> => {
        return new Promise(resolve => setTimeout(() => resolve(MOCK_CAMPAIGNS), 200));
    },

    // [TELNYX HOOK] Start a new blast job
    sendBatch: async (config: any, onProgress: (stats: any) => void) => {
        let sent = 0;
        const total = config.recipients || 1000;
        
        // Dispatch batch call to Telnyx / Supabase backend route
        try {
            fetch(`${process.env.NEXT_PUBLIC_BASE}/api/blast/send`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    recipients: Array.from({ length: Math.min(10, total) }).map((_, i) => `+1800555010${i}`),
                    message: config.message || "Exclusive Retirement Wealth Report: Secure your assets today.",
                    campaignId: config.campaignId || "c-live"
                })
            }).catch(e => console.warn('[Blast API] Telephony route notice:', e));
        } catch (e) {}

        const interval = setInterval(() => {
            sent += Math.floor(Math.random() * 5) + 1;
            if (sent >= total) {
                sent = total;
                clearInterval(interval);
            }
            onProgress({
                queued: total - sent,
                sent: sent,
                delivered: Math.floor(sent * 0.94),
                replied: Math.floor(sent * 0.02),
                failed: Math.floor(sent * 0.04),
                stops: Math.floor(sent * 0.01)
            });
        }, 1500);
    }
};

export * from "./telephony";

