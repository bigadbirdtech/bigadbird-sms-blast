-- Plain-Postgres version of lib/supabase/db-schema.sql (no storage buckets or realtime). Safe to re-run.
-- 1. AI CALL RECORDS TABLE
CREATE TABLE IF NOT EXISTS public.call_records (
    id TEXT PRIMARY KEY,
    workspace_id TEXT,
    conversation_id TEXT,
    receiver_name TEXT NOT NULL,
    receiver_phone TEXT NOT NULL,
    campaign TEXT DEFAULT 'General Outreach',
    status TEXT NOT NULL CHECK (status IN ('Ringing', 'Connected', 'Completed', 'Failed')),
    outcome TEXT NOT NULL CHECK (outcome IN ('Qualified & Booked', 'Follow-up Needed', 'Unqualified', 'Voicemail')),
    qualification JSONB DEFAULT '{"investableAssets": "$500,000+", "hasFiduciary": false, "timeline": "Immediate"}'::jsonb,
    booked_slot TEXT,
    duration_seconds INTEGER DEFAULT 0,
    transcript JSONB DEFAULT '[]'::jsonb,
    recording_url TEXT,
    voice_engine TEXT DEFAULT 'Fish Audio (S2.1-Pro Neural TTS)',
    started_at TEXT,
    ended_at TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for speedy search & live dashboard filters
CREATE INDEX IF NOT EXISTS idx_call_records_status ON public.call_records(status);
CREATE INDEX IF NOT EXISTS idx_call_records_outcome ON public.call_records(outcome);
CREATE INDEX IF NOT EXISTS idx_call_records_created_at ON public.call_records(created_at DESC);

-- 2. SMS BLAST CAMPAIGNS TABLE
CREATE TABLE IF NOT EXISTS public.blast_campaigns (
    id TEXT PRIMARY KEY,
    workspace_id TEXT,
    name TEXT NOT NULL,
    audience_type TEXT NOT NULL,
    total_recipients INTEGER DEFAULT 0,
    sent_count INTEGER DEFAULT 0,
    delivered_count INTEGER DEFAULT 0,
    response_count INTEGER DEFAULT 0,
    opt_out_count INTEGER DEFAULT 0,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'running', 'paused', 'completed')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SMS BLAST MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.blast_messages (
    id TEXT PRIMARY KEY,
    workspace_id TEXT,
    campaign_id TEXT REFERENCES public.blast_campaigns(id) ON DELETE SET NULL,
    to_phone TEXT NOT NULL,
    from_phone TEXT NOT NULL,
    body TEXT NOT NULL,
    status TEXT DEFAULT 'queued' CHECK (status IN ('queued', 'sending', 'delivered', 'failed', 'received')),
    direction TEXT DEFAULT 'outbound' CHECK (direction IN ('outbound', 'inbound')),
    telnyx_id TEXT,
    sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blast_messages_campaign ON public.blast_messages(campaign_id);
CREATE INDEX IF NOT EXISTS idx_blast_messages_to ON public.blast_messages(to_phone);

