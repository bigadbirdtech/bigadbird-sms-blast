import { requireSession } from "@/lib/session";
import { BlastDashboard } from "./blast-client";
import { connection } from "next/server";


export default async function BlastPage({ params }: { params: Promise<{ slug: string }> }) {
    await connection();
    await requireSession();
    const { slug } = await params;
    
    return <BlastDashboard workspaceSlug={slug} />;
}
