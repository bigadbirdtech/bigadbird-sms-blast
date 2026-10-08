import { createClient, SupabaseClient } from "@supabase/supabase-js";

let clientInstance: SupabaseClient | null = null;

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dhbvioviklsaqiwuxjtj.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder";

export function getSupabaseBrowserClient(): SupabaseClient {
    if (typeof window === "undefined") {
        return createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }

    if (!clientInstance) {
        clientInstance = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
            auth: {
                persistSession: true,
                autoRefreshToken: true,
                detectSessionInUrl: true,
            },
        });
    }

    return clientInstance;
}

export const supabase = getSupabaseBrowserClient();
