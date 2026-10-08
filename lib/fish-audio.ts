// Fish Audio S2.1-Pro Neural TTS Engine Client & Visualizer

export interface FishVoiceModel {
    id: string;
    name: string;
    tagline: string;
    gender: 'female' | 'male';
    accent: string;
    recommendedFor: string;
}

export const FISH_VOICE_PRESETS: FishVoiceModel[] = [
    {
        id: "7f92f8afb8ec43bf81429cc1c9199cb1",
        name: "Sarah Jenkins",
        tagline: "Executive Wealth Advisor",
        gender: "female",
        accent: "American (Professional Warm)",
        recommendedFor: "High-ticket financial planning & discovery calls"
    },
    {
        id: "e3d548b8dcbf4bb78b5e2832f05a8f90",
        name: "Marcus Vance",
        tagline: "Senior Portfolio Strategist",
        gender: "male",
        accent: "American (Deep Authoritative)",
        recommendedFor: "Institutional pitches & executive outreach"
    },
    {
        id: "54d68c92f15049b1a5a02476ef8dc87c",
        name: "Elena Rostova",
        tagline: "High-Net-Worth Specialist",
        gender: "female",
        accent: "Mid-Atlantic (Polished Calm)",
        recommendedFor: "Tax mitigation & estate planning outreach"
    }
];

// Audio cache to ensure 0-latency playback on repeated phrases
const AUDIO_CACHE = new Map<string, string>();

export class FishAudioPlayer {
    private currentAudio: HTMLAudioElement | null = null;
    private audioContext: AudioContext | null = null;
    private analyser: AnalyserNode | null = null;
    private isPlaying: boolean = false;
    private onPlayStateChange?: (playing: boolean) => void;

    constructor(onPlayStateChange?: (playing: boolean) => void) {
        this.onPlayStateChange = onPlayStateChange;
    }

    public isCurrentlyPlaying(): boolean {
        return this.isPlaying;
    }

    public stop() {
        if (this.currentAudio) {
            this.currentAudio.pause();
            this.currentAudio.currentTime = 0;
            this.currentAudio = null;
        }
        this.isPlaying = false;
        if (this.onPlayStateChange) this.onPlayStateChange(false);
    }

    public async speak(
        text: string, 
        voiceId: string = FISH_VOICE_PRESETS[0]!.id,
        onAudioData?: () => void
    ): Promise<boolean> {
        this.stop();

        const cacheKey = `${voiceId}:${text.trim()}`;
        let audioUrl = AUDIO_CACHE.get(cacheKey);

        if (!audioUrl) {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BASE}/api/voice/fish-audio`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        text,
                        voiceId,
                        format: "mp3",
                        latency: "normal"
                    })
                });

                if (!res.ok) {
                    return false;
                }

                // Check if response is JSON (fallback) or raw audio stream
                const contentType = res.headers.get("content-type") || "";
                if (contentType.includes("application/json")) {
                    const data = await res.json();
                    if (data.fallback) {
                        return false; // Trigger browser fallback
                    }
                }

                const blob = await res.blob();
                audioUrl = URL.createObjectURL(blob);
                AUDIO_CACHE.set(cacheKey, audioUrl);
            } catch (err) {
                console.warn("[FishAudio] Failed to fetch remote synthesis:", err);
                return false;
            }
        }

        try {
            const audio = new Audio(audioUrl);
            this.currentAudio = audio;
            this.isPlaying = true;
            if (this.onPlayStateChange) this.onPlayStateChange(true);

            audio.onended = () => {
                this.isPlaying = false;
                if (this.onPlayStateChange) this.onPlayStateChange(false);
            };

            audio.onerror = () => {
                this.isPlaying = false;
                if (this.onPlayStateChange) this.onPlayStateChange(false);
            };

            await audio.play();
            if (onAudioData) onAudioData();
            return true;
        } catch (e) {
            this.isPlaying = false;
            if (this.onPlayStateChange) this.onPlayStateChange(false);
            return false;
        }
    }
}
