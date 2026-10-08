import { NextRequest, NextResponse } from "next/server";
import { db } from "@crm/db";

export async function POST(req: NextRequest) {
    try {
        const payload = await req.json();
        const eventType = payload?.data?.event_type;
        const messageData = payload?.data?.payload;

        if (!eventType || !messageData) {
            return NextResponse.json({ received: true });
        }

        if (eventType === "message.received") {
            const fromPhone = messageData.from?.phone_number;
            const toPhone = messageData.to?.[0]?.phone_number;
            const text = (messageData.text || "").trim();
            const upperText = text.toUpperCase();

            const isStop = ["STOP", "UNSUBSCRIBE", "CANCEL", "QUIT", "END"].some(kw => upperText.includes(kw));
            const isYes = ["YES", "INFO", "MORE INFO", "INTERESTED", "CALL ME"].some(kw => upperText.includes(kw));

            // Log inbound message directly into Supabase
            const msgId = `inbound-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
            await db.$executeRawUnsafe(`
                INSERT INTO public.blast_messages (
                    id, to_phone, from_phone, body, status, direction, telnyx_id, sent_at
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
            `, msgId, toPhone, fromPhone, text, "received", "inbound", messageData.id || null);

            console.log(`[Telnyx Inbound SMS] From: ${fromPhone} | Content: "${text}" | Stop: ${isStop} | Yes: ${isYes}`);
        } else if (eventType === "message.finalized" || eventType === "message.delivered") {
            const telnyxId = messageData.id;
            const deliveryStatus = messageData.to?.[0]?.status === "delivered" ? "delivered" : "failed";

            await db.$executeRawUnsafe(`
                UPDATE public.blast_messages 
                SET status = $1 
                WHERE telnyx_id = $2
            `, deliveryStatus, telnyxId);
        }

        return NextResponse.json({ received: true });

    } catch (err: any) {
        console.error("[Telnyx Webhook Error]", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
