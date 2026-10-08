import { NextRequest, NextResponse } from "next/server";
import { db } from "@crm/db";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { recipients, message, campaignId, fromNumber } = body;

        if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
            return NextResponse.json({ error: "No recipients provided" }, { status: 400 });
        }

        if (!message || typeof message !== "string") {
            return NextResponse.json({ error: "Message text is required" }, { status: 400 });
        }

        const telnyxApiKey = process.env.TELNYX_API_KEY;
        const sender = fromNumber || process.env.TELNYX_PHONE_NUMBER || "+18005550199";

        const results = [];

        // If Telnyx API Key is present, dispatch real SMS
        if (telnyxApiKey) {
            for (const recipient of recipients) {
                const phone = typeof recipient === "string" ? recipient : recipient.phone;
                try {
                    const response = await fetch("https://api.telnyx.com/v2/messages", {
                        method: "POST",
                        headers: {
                            "Authorization": `Bearer ${telnyxApiKey}`,
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            from: sender,
                            to: phone,
                            text: message
                        })
                    });

                    const telnyxData = await response.json();
                    const telnyxId = telnyxData?.data?.id;

                    // Direct write to Supabase
                    const msgId = `msg-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
                    await db.$executeRawUnsafe(`
                        INSERT INTO public.blast_messages (
                            id, campaign_id, to_phone, from_phone, body, status, direction, telnyx_id, sent_at
                        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
                    `, msgId, campaignId || null, phone, sender, message, response.ok ? "sending" : "failed", "outbound", telnyxId || null);

                    results.push({ phone, success: response.ok, telnyxId });
                } catch (sendErr: any) {
                    results.push({ phone, success: false, error: sendErr.message });
                }
            }
        } else {
            // Simulated queueing & direct write to Supabase
            for (const recipient of recipients) {
                const phone = typeof recipient === "string" ? recipient : recipient.phone;
                const msgId = `msg-sim-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

                await db.$executeRawUnsafe(`
                    INSERT INTO public.blast_messages (
                        id, campaign_id, to_phone, from_phone, body, status, direction, sent_at
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
                `, msgId, campaignId || null, phone, sender, message, "delivered", "outbound");

                results.push({ phone, success: true, simulated: true });
            }
        }

        return NextResponse.json({
            success: true,
            totalDispatched: results.length,
            results,
            mode: telnyxApiKey ? "live_telnyx" : "simulator"
        });

    } catch (err: any) {
        console.error("[Blast Send Error]", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
