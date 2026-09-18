import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ReportTicket } from '../types';

// Default Supabase project configuration provided by user
export const SUPABASE_PROJECT_ID = 'kpxcidewzqaecxbkyeai';

/**
 * Safely resolves and validates the Supabase URL, guaranteeing a valid HTTP/HTTPS URL
 */
export function resolveSupabaseUrl(): string {
  let raw: unknown = '';
  try {
    raw = (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_SUPABASE_URL;
  } catch {
    raw = '';
  }

  const str = String(raw ?? '').trim();
  if (!str || str === 'undefined' || str === 'null') {
    return `https://${SUPABASE_PROJECT_ID}.supabase.co`;
  }

  const normalized = str.startsWith('http://') || str.startsWith('https://') ? str : `https://${str}`;
  try {
    const parsed = new URL(normalized);
    return parsed.origin;
  } catch {
    return `https://${SUPABASE_PROJECT_ID}.supabase.co`;
  }
}

/**
 * Safely resolves the Supabase anon/publishable key
 */
export function resolveSupabaseAnonKey(): string {
  let raw: unknown = '';
  try {
    raw = (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_SUPABASE_ANON_KEY;
  } catch {
    raw = '';
  }

  const str = String(raw ?? '').trim();
  if (!str || str === 'undefined' || str === 'null') {
    return 'sb_publishable_6f1YBrN8Ooqwg8j1m2Fcvg_YzA4gBs6';
  }
  return str;
}

export const SUPABASE_URL = resolveSupabaseUrl();
export const SUPABASE_ANON_KEY = resolveSupabaseAnonKey();

// Lazy safe Supabase client singleton
let _clientInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (!_clientInstance) {
    try {
      const url = resolveSupabaseUrl();
      const key = resolveSupabaseAnonKey();
      _clientInstance = createClient(url, key);
    } catch (err) {
      console.warn('Supabase client initialization warning:', err);
      return null;
    }
  }
  return _clientInstance;
}

// Proxy wrapper for backward compatibility with `supabase.from(...)`
// Ensures that even if credentials or network fail, the app never crashes with an unhandled exception
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getSupabaseClient();
    if (!client) {
      if (prop === 'from') {
        return () => ({
          insert: async () => ({ data: null, error: { message: 'Supabase client not initialized', code: 'INIT_ERROR' } }),
          select: () => {
            const chain: any = {
              order: () => chain,
              limit: () => chain,
              then: (onfulfilled: (res: any) => any) =>
                Promise.resolve(onfulfilled({ data: [], error: { message: 'Supabase client not initialized' } })),
            };
            return chain;
          },
          update: () => ({
            eq: async () => ({ data: null, error: { message: 'Supabase client not initialized' } }),
          }),
          delete: () => ({
            eq: async () => ({ data: null, error: { message: 'Supabase client not initialized' } }),
          }),
        });
      }
      return undefined;
    }

    const value = (client as any)[prop];
    if (typeof value === 'function') {
      return value.bind(client);
    }
    return value;
  },
});

export interface SupabaseSyncResult {
  success: boolean;
  message?: string;
  tableNotFound?: boolean;
  error?: any;
}

// SQL helper query for user to set up their Supabase table if not already created
export const SUPABASE_TABLE_SQL = `-- Run this in your Supabase SQL Editor (SQL Editor -> New query)
CREATE TABLE IF NOT EXISTS public.reports (
  id TEXT PRIMARY KEY,
  bin_id TEXT,
  bin_name TEXT,
  location_name TEXT,
  issue_type TEXT,
  details TEXT,
  reported_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()),
  status TEXT DEFAULT 'pending',
  reported_by TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Enable Row Level Security
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Allow public read & insert & update
DROP POLICY IF EXISTS "Allow public read on reports" ON public.reports;
CREATE POLICY "Allow public read on reports"
ON public.reports FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Allow public insert on reports" ON public.reports;
CREATE POLICY "Allow public insert on reports"
ON public.reports FOR INSERT
TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update on reports" ON public.reports;
CREATE POLICY "Allow public update on reports"
ON public.reports FOR UPDATE
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Allow public delete on reports" ON public.reports;
CREATE POLICY "Allow public delete on reports"
ON public.reports FOR DELETE
TO anon, authenticated
USING (true);
`;

/**
 * Saves a new report to Supabase
 */
export async function saveReportToSupabase(ticket: ReportTicket): Promise<SupabaseSyncResult> {
  try {
    // 1. First attempt standard snake_case column schema on 'reports'
    const snakeCasePayload = {
      id: ticket.id,
      bin_id: ticket.binId,
      bin_name: ticket.binName,
      location_name: ticket.locationName,
      issue_type: ticket.issueType,
      details: ticket.details,
      reported_at: new Date().toISOString(),
      status: ticket.status,
      reported_by: ticket.reportedBy,
    };

    const { error: err1 } = await supabase.from('reports').insert([snakeCasePayload]);

    if (!err1) {
      return { success: true, message: 'Saved to Supabase "reports" table' };
    }

    // Check if table not found
    if (err1.code === 'PGRST205' || err1.message?.includes('Could not find the table')) {
      // Try fallback to camelCase columns or alternative table 'report_tickets'
      const { error: errTickets } = await supabase.from('report_tickets').insert([snakeCasePayload]);
      if (!errTickets) {
        return { success: true, message: 'Saved to Supabase "report_tickets" table' };
      }

      return {
        success: false,
        tableNotFound: true,
        message: 'Table "reports" has not been created yet in your Supabase project.',
        error: err1,
      };
    }

    // If error was due to unknown columns, try camelCase schema
    if (err1.message?.includes('column') || err1.code === '42703') {
      const camelCasePayload = {
        id: ticket.id,
        binId: ticket.binId,
        binName: ticket.binName,
        locationName: ticket.locationName,
        issueType: ticket.issueType,
        details: ticket.details,
        reportedAt: new Date().toISOString(),
        status: ticket.status,
        reportedBy: ticket.reportedBy,
      };

      const { error: err2 } = await supabase.from('reports').insert([camelCasePayload]);
      if (!err2) {
        return { success: true, message: 'Saved to Supabase (camelCase)' };
      }
    }

    return {
      success: false,
      message: err1.message || 'Error inserting into Supabase',
      error: err1,
    };
  } catch (error: any) {
    console.warn('Supabase save report exception:', error);
    return {
      success: false,
      message: error?.message || 'Failed to connect to Supabase backend',
      error,
    };
  }
}

/**
 * Fetches all reports from Supabase backend
 */
export async function fetchReportsFromSupabase(): Promise<{
  success: boolean;
  tickets?: ReportTicket[];
  tableNotFound?: boolean;
  error?: any;
}> {
  try {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .order('reported_at', { ascending: false });

    if (error) {
      if (error.code === 'PGRST205' || error.message?.includes('Could not find the table')) {
        return { success: false, tableNotFound: true, error };
      }
      return { success: false, error };
    }

    if (!data || data.length === 0) {
      return { success: true, tickets: [] };
    }

    // Map database records to ReportTicket structure (support snake_case and camelCase)
    const formatted: ReportTicket[] = data.map((row: any) => ({
      id: String(row.id || `t-${Math.random()}`),
      binId: String(row.bin_id || row.binId || 'bin-custom'),
      binName: String(row.bin_name || row.binName || 'Campus Bin'),
      locationName: String(row.location_name || row.locationName || 'Campus Location'),
      issueType: (row.issue_type || row.issueType || 'overflowing') as ReportTicket['issueType'],
      details: String(row.details || ''),
      reportedAt: row.reported_at
        ? formatReportedTime(row.reported_at)
        : row.reportedAt || 'Recently',
      status: (row.status || 'pending') as ReportTicket['status'],
      reportedBy: String(row.reported_by || row.reportedBy || 'Anonymous'),
    }));

    return { success: true, tickets: formatted };
  } catch (err: any) {
    console.warn('Failed to fetch from Supabase:', err);
    return { success: false, error: err };
  }
}

/**
 * Updates a report's status in Supabase (e.g. dispatched, resolved)
 */
export async function updateTicketStatusInSupabase(
  ticketId: string,
  status: 'pending' | 'cleaning_dispatched' | 'resolved'
): Promise<SupabaseSyncResult> {
  try {
    const { error } = await supabase
      .from('reports')
      .update({ status })
      .eq('id', ticketId);

    if (error) {
      return { success: false, error, message: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err, message: err?.message };
  }
}

/**
 * Deletes a report ticket in Supabase
 */
export async function deleteTicketFromSupabase(ticketId: string): Promise<SupabaseSyncResult> {
  try {
    const { error } = await supabase
      .from('reports')
      .delete()
      .eq('id', ticketId);

    if (error) {
      return { success: false, error, message: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err, message: err?.message };
  }
}

/**
 * Checks if Supabase connection & reports table are available
 */
export async function checkSupabaseStatus(): Promise<{
  connected: boolean;
  tableExists: boolean;
  message: string;
}> {
  try {
    const { error } = await supabase.from('reports').select('id').limit(1);

    if (!error) {
      return { connected: true, tableExists: true, message: 'Connected to Supabase "reports" table' };
    }

    if (error.code === 'PGRST205' || error.message?.includes('Could not find the table')) {
      return {
        connected: true,
        tableExists: false,
        message: 'Supabase connected, but "reports" table needs to be created.',
      };
    }

    return {
      connected: false,
      tableExists: false,
      message: error.message || 'Could not connect to Supabase',
    };
  } catch (err: any) {
    return {
      connected: false,
      tableExists: false,
      message: err?.message || 'Supabase connection failed',
    };
  }
}

function formatReportedTime(timestamp: string): string {
  try {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  } catch {
    return 'Recently';
  }
}
