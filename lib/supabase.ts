import { createClient } from "@supabase/supabase-js"
import { auth } from "@clerk/nextjs/server"

export const createSupabaseClient = () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key =
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ??
        process.env.SUPABASE_ANON_KEY ??
        process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
        throw new Error(
            'Supabase env vars missing. Ensure NEXT_PUBLIC_SUPABASE_URL and one of NEXT_PUBLIC_SUPABASE_ANON_KEY, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY, SUPABASE_ANON_KEY or SUPABASE_SERVICE_ROLE_KEY are set.'
        );
    }

    return createClient(url, key, {
        async accessToken() {
            return (await auth()).getToken();
        }
    });
}