import { createClient, SupabaseClient } from '@supabase/supabase-js';

const STORAGE_KEY_CUSTOM_URL = 'spellquest_custom_supabase_url';
const STORAGE_KEY_CUSTOM_KEY = 'spellquest_custom_supabase_key';

let supabaseInstance: SupabaseClient | null = null;
let currentConfiguredUrl = '';
let currentConfiguredKey = '';

export interface SupabaseConfigInfo {
  url: string;
  key: string;
  isConfigured: boolean;
  source: 'env' | 'custom' | 'none';
}

/**
 * Resolve current active Supabase URL and Key (prefers custom in-browser storage, falls back to env)
 */
export function getSupabaseConfig(): SupabaseConfigInfo {
  let customUrl = '';
  let customKey = '';

  if (typeof window !== 'undefined') {
    try {
      customUrl = localStorage.getItem(STORAGE_KEY_CUSTOM_URL) || '';
      customKey = localStorage.getItem(STORAGE_KEY_CUSTOM_KEY) || '';
    } catch {
      // localStorage may fail in restricted environments
    }
  }

  const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const envKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (customUrl && customKey) {
    return {
      url: customUrl,
      key: customKey,
      isConfigured: true,
      source: 'custom',
    };
  }

  if (envUrl && envKey) {
    return {
      url: envUrl,
      key: envKey,
      isConfigured: true,
      source: 'env',
    };
  }

  return {
    url: '',
    key: '',
    isConfigured: false,
    source: 'none',
  };
}

export const isSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

/**
 * Get active Supabase client singleton
 */
export function getSupabase(): SupabaseClient | null {
  const config = getSupabaseConfig();
  if (!config.isConfigured) {
    return null;
  }

  if (
    !supabaseInstance ||
    currentConfiguredUrl !== config.url ||
    currentConfiguredKey !== config.key
  ) {
    try {
      supabaseInstance = createClient(config.url, config.key, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      });
      currentConfiguredUrl = config.url;
      currentConfiguredKey = config.key;
    } catch (e) {
      console.warn('Failed to initialize Supabase client:', e);
      return null;
    }
  }

  return supabaseInstance;
}

/**
 * Save custom Supabase credentials from the Admin Control Panel
 */
export function saveCustomSupabaseConfig(url: string, key: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_CUSTOM_URL, url.trim());
    localStorage.setItem(STORAGE_KEY_CUSTOM_KEY, key.trim());
    supabaseInstance = null; // force re-instantiation
  } catch (e) {
    console.warn('Could not save Supabase configuration:', e);
  }
}

/**
 * Disconnect / clear custom Supabase configuration
 */
export function clearCustomSupabaseConfig(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY_CUSTOM_URL);
    localStorage.removeItem(STORAGE_KEY_CUSTOM_KEY);
    supabaseInstance = null;
  } catch (e) {
    console.warn('Could not clear Supabase configuration:', e);
  }
}

/**
 * Test connectivity against Supabase
 */
export async function testSupabaseConnection(
  testUrl?: string,
  testKey?: string
): Promise<{ success: boolean; message: string; latencyMs?: number }> {
  const targetUrl = testUrl || getSupabaseConfig().url;
  const targetKey = testKey || getSupabaseConfig().key;

  if (!targetUrl || !targetKey) {
    return {
      success: false,
      message: 'Missing Supabase URL or Anon Public Key.',
    };
  }

  const startTime = Date.now();
  try {
    const client = createClient(targetUrl.trim(), targetKey.trim(), {
      auth: { persistSession: false },
    });

    // Test query against students table or root endpoint
    const { error } = await client.from('students').select('id').limit(1);
    const latencyMs = Date.now() - startTime;

    if (error) {
      // If table doesn't exist yet, endpoint is still reachable
      if (error.code === '42P01' || error.message.includes('relation "students" does not exist')) {
        return {
          success: true,
          message: `Connected successfully (${latencyMs}ms)! Note: The 'students' table is not yet created. Run schema.sql in Supabase SQL Editor.`,
          latencyMs,
        };
      }
      return {
        success: false,
        message: `Connection test error: ${error.message} (Code: ${error.code || 'unknown'})`,
        latencyMs,
      };
    }

    return {
      success: true,
      message: `Database connection verified! Ping: ${latencyMs}ms. Ready for live sync.`,
      latencyMs,
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Network failure connecting to Supabase: ${err.message || 'Unknown network error'}. Verify project URL.`,
    };
  }
}
