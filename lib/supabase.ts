import { createClient } from '@supabase/supabase-js';
let client: ReturnType<typeof createClient> | null = null;
export function browserDB() { const url=process.env.NEXT_PUBLIC_SUPABASE_URL, key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY; if(!url||!key)return null; return client ??=createClient(url,key); }
export const demoMode=process.env.NEXT_PUBLIC_DATA_MODE!=='live';
