import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://kgwhrftenthdtoeffhfa.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtnd2hyZnRlbnRoZHRvZWZmaGZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA4Mjc2MjksImV4cCI6MjEwNjQwMzYyOX0.PY3kEGG3fKsxfFVS_8rcxBUpxJSzBlNY-9HaV06_Xjc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
