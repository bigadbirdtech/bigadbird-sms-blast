import { Suspense } from "react";
import { CallingClient } from "./calling-client";

export default function CallingPage({ params }: { params: Promise<{ slug: string }> }) {
    return (
        <Suspense fallback={<div className="flex-1 flex items-center justify-center font-mono text-sm tracking-widest uppercase text-slate-400">CONNECTING VOICE TRUNKS...</div>}>
            <CallingContent params={params} />
        </Suspense>
    );
}

async function CallingContent({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    return <CallingClient workspaceSlug={slug} />;
}
