import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase configuration is missing. Authentication and database features will be disabled.');
  console.warn('Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your environment variables.');
} else {
  try {
    const url = new URL(supabaseUrl);
    if (!url.hostname.endsWith('.supabase.co')) {
      console.warn('Supabase URL does not look like a standard Supabase endpoint:', supabaseUrl);
    }
  } catch (e) {
    console.error('Invalid Supabase URL provided:', supabaseUrl);
  }
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);
