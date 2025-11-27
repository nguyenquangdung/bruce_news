import { createClient } from '@supabase/supabase-js';

// --- CONFIGURATION ---
// TODO: REPLACE THESE WITH YOUR ACTUAL SUPABASE KEYS
// Go to Supabase Project -> Settings -> API
const SUPABASE_URL = 'https://fbejjtkjoxpreiyjqhpo.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZiZWpqdGtqb3hwcmVpeWpxaHBvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyMTAyMTUsImV4cCI6MjA3OTc4NjIxNX0.hbHz1vau7f7O-EyswfqzyQSq0yEuxHzpMEsYAixcD9w';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);