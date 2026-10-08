# Standalone SMS Blast & Telephony Calling System
**Preserved & Separated as an Independent System**

## Core Modules Preserved:
1. **SMS Blaster (`/blast`)**:
   - Mass SMS campaign dispatcher (`/api/blast/send`)
   - Campaign manager, contact groups, templates, and delivery progress visualizer
   - Live conversation threads and recipient lists
2. **Calling System (`/calling`)**:
   - Calling dashboard and live call modal (`live-call-modal.tsx`)
   - Call audio logging and recording router (`/api/calling/record`)
3. **Voice AI (Fish Audio)**:
   - Real-time TTS engine (`lib/fish-audio.ts`, `/api/voice/fish-audio`)
   - Waveform live canvas visualizer
4. **Telephony & Webhooks (Telnyx)**:
   - Telnyx SMS & voice webhook handler (`/api/webhooks/telnyx`)
   - Telephony client utilities (`lib/telephony.ts`)
5. **Database (Supabase)**:
   - Dedicated schemas: `public.blast_campaigns`, `public.blast_messages`, `public.call_records`
   - Client and server connectors (`lib/supabase/client.ts`, `lib/supabase/server.ts`)
   - SQL definitions (`lib/supabase/db-schema.sql`)
