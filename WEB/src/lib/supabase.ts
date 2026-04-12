import { createClient } from '@supabase/supabase-js';

// Runtime env vars — process.env is read at runtime, not inlined at build time
const supabaseUrl = process.env.SUPABASE_URL || import.meta.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || import.meta.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');
