export interface SupabaseCallRecord {
    id: string;
    workspace_id?: string;
    conversation_id?: string;
    receiver_name: string;
    receiver_phone: string;
    campaign: string;
    status: 'Ringing' | 'Connected' | 'Completed' | 'Failed';
    outcome: 'Qualified & Booked' | 'Follow-up Needed' | 'Unqualified' | 'Voicemail';
    qualification: {
        investableAssets: string;
        hasFiduciary: boolean;
        timeline: string;
    };
    booked_slot?: string;
    duration_seconds: number;
    transcript: Array<{
        speaker: 'AI' | 'Prospect';
        text: string;
        timestamp: string;
    }>;
    recording_url?: string;
    started_at: string;
    ended_at?: string;
    created_at?: string;
}

export interface SupabaseBlastMessage {
    id: string;
    workspace_id?: string;
    campaign_id?: string;
    to_phone: string;
    from_phone: string;
    body: string;
    status: 'queued' | 'sending' | 'delivered' | 'failed' | 'received';
    direction: 'outbound' | 'inbound';
    telnyx_id?: string;
    sent_at?: string;
    created_at?: string;
}

export interface SupabaseBlastCampaign {
    id: string;
    workspace_id?: string;
    name: string;
    audience_type: string;
    total_recipients: number;
    sent_count: number;
    delivered_count: number;
    response_count: number;
    opt_out_count: number;
    status: 'draft' | 'running' | 'paused' | 'completed';
    created_at?: string;
}
