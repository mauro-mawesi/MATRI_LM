import { createClient } from '@supabase/supabase-js';

const FALLBACK_URL = 'http://172.28.18.200:8001';
const FALLBACK_ANON_KEY = 'eyJhbGciOiAiSFMyNTYiLCAidHlwIjogIkpXVCJ9.eyJyb2xlIjogImFub24iLCAiaXNzIjogInN1cGFiYXNlLWRlbW8iLCAiaWF0IjogMTY0MTc2OTIwMCwgImV4cCI6IDE3OTk1MzU2MDB9.MvkmT8yqsIEIKSqZqdZxPfMRAp5mH5gKJsl9voFelHI';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || FALLBACK_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || FALLBACK_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
