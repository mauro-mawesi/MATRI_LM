import { createClient } from '@supabase/supabase-js';

// Server-only — these vars have NO PUBLIC_ prefix so Astro never sends them to the browser
const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabaseAnonKey = import.meta.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');
