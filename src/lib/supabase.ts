import { createClient } from '@supabase/supabase-js';

// Read client credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('YOUR_SUPABASE') &&
  supabaseUrl.startsWith('https://')
);

// Graceful client creation: if not configured, create a mock or dummy client
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://placeholder-faveda.supabase.co', 'placeholder-anon-key');

export interface SupabaseConfigStatus {
  isConfigured: boolean;
  url: string;
}

export function getSupabaseStatus(): SupabaseConfigStatus {
  return {
    isConfigured: isSupabaseConfigured,
    url: isSupabaseConfigured ? supabaseUrl : 'Non configuré (mode local persistant actif)',
  };
}
