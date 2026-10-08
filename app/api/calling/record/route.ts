import { NextRequest, NextResponse } from "next/server";
import { db } from "@crm/db";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { call, workspaceId } = body;

        if (!call || !call.id) {
            return NextResponse.json({ error: "Missing call object or call ID" }, { status: 400 });
        }

        const qualificationJson = JSON.stringify(call.qualification || {});
        const transcriptJson = JSON.stringify(call.transcript || []);

        await db.$executeRawUnsafe(`
            INSERT INTO public.call_records (
                id, workspace_id, conversation_id, receiver_name, receiver_phone,
                campaign, status, outcome, qualification, booked_slot,
                duration_seconds, transcript, recording_url, voice_engine,
                started_at, ended_at, updated_at
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9::jsonb, $10, $11, $12::jsonb, $13, $14, $15, $16, NOW()
            )
            ON CONFLICT (id) DO UPDATE SET
                status = EXCLUDED.status,
                outcome = EXCLUDED.outcome,
                duration_seconds = EXCLUDED.duration_seconds,
                transcript = EXCLUDED.transcript,
                booked_slot = EXCLUDED.booked_slot,
                ended_at = EXCLUDED.ended_at,
                updated_at = NOW()
        `,
            call.id,
            workspaceId || null,
            call.conversationId || null,
            call.receiverName,
            call.receiverPhone,
            call.campaign || "General Outreach",
            call.status,
            call.outcome,
            qualificationJson,
            call.bookedSlot || null,
            call.durationSeconds || 0,
            transcriptJson,
            call.recordingUrl || null,
            "Fish Audio (S2.1-Pro Neural TTS)",
            call.startedAt || new Date().toISOString(),
            call.endedAt || null
        );

        return NextResponse.json({ success: true, callId: call.id });

    } catch (err: any) {
        console.error("[Call Record API Error]", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const records = await db.$queryRawUnsafe(`
            SELECT * FROM public.call_records 
            ORDER BY created_at DESC 
            LIMIT 100
        `);

        return NextResponse.json({ calls: records });
    } catch (err: any) {
        console.error("[Call Record Query Error]", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
