import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { text, voiceId, format = "mp3", latency = "normal" } = body;

        if (!text || typeof text !== "string") {
            return NextResponse.json({ error: "Missing or invalid text parameter" }, { status: 400 });
        }

        const apiKey = process.env.FISH_AUDIO_API_KEY;

        // If no API key configured yet, gracefully return fallback flag
        if (!apiKey) {
            return NextResponse.json({ 
                fallback: true, 
                message: "FISH_AUDIO_API_KEY not configured. Falling back to browser speech synthesis engine." 
            });
        }

        // Call official Fish Audio v1 TTS API
        const response = await fetch("https://api.fish.audio/v1/tts", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                text,
                reference_id: voiceId || process.env.FISH_AUDIO_DEFAULT_VOICE_ID || "7f92f8afb8ec43bf81429cc1c9199cb1",
                format,
                latency
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("[FishAudio API Error]", response.status, errorText);
            return NextResponse.json({ 
                fallback: true, 
                error: `Fish Audio returned status ${response.status}: ${errorText}` 
            }, { status: 502 });
        }

        // Forward raw audio stream back to the client
        const audioBuffer = await response.arrayBuffer();

        return new NextResponse(audioBuffer, {
            status: 200,
            headers: {
                "Content-Type": format === "wav" ? "audio/wav" : "audio/mpeg",
                "Content-Length": audioBuffer.byteLength.toString(),
                "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800"
            }
        });

    } catch (err: any) {
        console.error("[FishAudio Route Exception]", err);
        return NextResponse.json({ fallback: true, error: err.message }, { status: 500 });
    }
}
