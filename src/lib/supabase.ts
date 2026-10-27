import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ReportTicket } from '../types';

// Supabase project credentials strictly read from environment variables.
// In accordance with security best practices, never expose secret keys in client bundles.
const ENV_SUPABASE_URL = import.meta.env?.VITE_SUPABASE_URL;
const ENV_ANON_KEY = import.meta.env?.VITE_SUPABASE_ANON_KEY;

// Safe fallback URL/key for local offline development when env vars are not configured
const SAFE_FALLBACK_URL = 'https://swachh-campus-local.supabase.co';
const SAFE_FALLBACK_KEY = 'sb_anon_placeholder_local_dev_only';

export const isSupabaseConfigured = Boolean(
  ENV_SUPABASE_URL && 
  ENV_ANON_KEY && 
  ENV_SUPABASE_URL.startsWith('http') && 
  ENV_ANON_KEY.length > 15 &&
  !ENV_SUPABASE_URL.includes('placeholder')
);

function getValidUrl(): string {
  if (ENV_SUPABASE_URL && typeof ENV_SUPABASE_URL === 'string' && ENV_SUPABASE_URL.startsWith('http')) {
    try {
      new URL(ENV_SUPABASE_URL.trim());
      return ENV_SUPABASE_URL.trim();
    } catch {}
  }
  return SAFE_FALLBACK_URL;
}

function getValidKey(): string {
  if (ENV_ANON_KEY && typeof ENV_ANON_KEY === 'string' && ENV_ANON_KEY.trim().length > 15) {
    return ENV_ANON_KEY.trim();
  }
  return SAFE_FALLBACK_KEY;
}

export const supabase: SupabaseClient = createClient(getValidUrl(), getValidKey(), {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

// Database record interface for 'reports' table
export interface DbReportRow {
  id: string;
  bin_id: string;
  bin_name: string;
  location_name: string;
  issue_type: string;
  details: string;
  reported_at: string;
  status: string;
  reported_by: string;
}

// Helper to convert any date string (including relative 'Just now', '25 mins ago', etc.)
// into a strictly valid ISO-8601 string for PostgreSQL TIMESTAMPTZ columns
export function toValidIsoDate(dateStr?: string): string {
  if (!dateStr) return new Date().toISOString();
  const trimmed = dateStr.trim();
  const parsed = new Date(trimmed);
  if (isNaN(parsed.getTime())) {
    return new Date().toISOString();
  }
  return parsed.toISOString();
}

// Helper to format ISO timestamp strings into user-friendly relative labels
export function formatReportTime(dateStr?: string): string {
  if (!dateStr) return 'Just now';
  const trimmed = dateStr.trim();
  const parsed = new Date(trimmed);
  if (isNaN(parsed.getTime())) {
    return trimmed; // Already relative like "Just now" or "25 mins ago"
  }
  const diffMs = Date.now() - parsed.getTime();
  if (diffMs < 0) return 'Just now';
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}

// Convert app ReportTicket to Supabase row format
export function toDbRow(ticket: ReportTicket): DbReportRow {
  return {
    id: ticket.id,
    bin_id: ticket.binId,
    bin_name: ticket.binName,
    location_name: ticket.locationName,
    issue_type: ticket.issueType,
    details: ticket.details || '',
    reported_at: toValidIsoDate(ticket.reportedAt),
    status: ticket.status,
    reported_by: ticket.reportedBy || 'Student',
  };
}

// Convert Supabase row to app ReportTicket format
export function fromDbRow(row: DbReportRow): ReportTicket {
  return {
    id: row.id,
    binId: row.bin_id,
    binName: row.bin_name,
    locationName: row.location_name,
    issueType: (row.issue_type as ReportTicket['issueType']) || 'overflowing',
    details: row.details || '',
    reportedAt: row.reported_at,
    status: (row.status as ReportTicket['status']) || 'pending',
    reportedBy: row.reported_by || 'Student',
  };
}

// Fetch all reports from Supabase
export async function fetchReportsFromSupabase(): Promise<{ data: ReportTicket[] | null; error: Error | null }> {
  if (!isSupabaseConfigured) {
    return { data: null, error: null };
  }
  try {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .order('reported_at', { ascending: false });

    if (error) {
      return { data: null, error: new Error('Remote database sync error') };
    }

    const tickets: ReportTicket[] = (data || []).map((row: DbReportRow) => fromDbRow(row));
    return { data: tickets, error: null };
  } catch (err: unknown) {
    return { data: null, error: err instanceof Error ? err : new Error('Remote database unreachable') };
  }
}

// Insert or upsert single report into Supabase
export async function insertReportToSupabase(
  ticket: ReportTicket
): Promise<{ success: boolean; error: Error | null; row?: DbReportRow }> {
  if (!isSupabaseConfigured) {
    return { success: true, error: null };
  }
  try {
    const payload = toDbRow(ticket);
    const { data, error } = await supabase
      .from('reports')
      .upsert(payload, { onConflict: 'id' })
      .select()
      .maybeSingle();

    if (error) {
      console.warn('[Supabase insertReport notice]:', error.message);
      return { success: false, error: new Error(error.message) };
    }
    return { success: true, error: null, row: data as DbReportRow | undefined };
  } catch (err: unknown) {
    console.warn('[Supabase insertReport notice - offline fallback]:', err);
    return { success: false, error: err instanceof Error ? err : new Error(String(err)) };
  }
}

// Bulk sync tickets to Supabase (e.g., seeding initial local reports or manual sync)
export async function syncAllLocalTicketsToSupabase(
  tickets: ReportTicket[]
): Promise<{ count: number; error: Error | null }> {
  if (!tickets || tickets.length === 0 || !isSupabaseConfigured) {
    return { count: tickets?.length ?? 0, error: null };
  }
  try {
    const payloads = tickets.map(toDbRow);
    const { data, error } = await supabase
      .from('reports')
      .upsert(payloads, { onConflict: 'id' })
      .select();

    if (error) {
      return { count: 0, error: new Error('Database bulk sync error') };
    }
    return { count: data?.length ?? payloads.length, error: null };
  } catch (err: unknown) {
    return { count: 0, error: err instanceof Error ? err : new Error('Database unreachable') };
  }
}

// Update report status in Supabase (with fallback full ticket upsert)
export async function updateReportStatusInSupabase(
  ticketId: string, 
  status: ReportTicket['status'],
  fullTicket?: ReportTicket
): Promise<{ success: boolean; error: Error | null }> {
  if (!isSupabaseConfigured) {
    return { success: true, error: null };
  }
  try {
    if (fullTicket) {
      const payload = toDbRow({ ...fullTicket, status });
      const { error } = await supabase
        .from('reports')
        .upsert(payload, { onConflict: 'id' });

      if (error) {
        return { success: false, error: new Error('Failed to update report record') };
      }
      return { success: true, error: null };
    }

    const { error } = await supabase
      .from('reports')
      .update({ status })
      .eq('id', ticketId);

    if (error) {
      return { success: false, error: new Error('Failed to update report record') };
    }
    return { success: true, error: null };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err : new Error('Database unreachable') };
  }
}

// Batch delete reports from Supabase in a single HTTP request
export async function deleteReportsFromSupabase(
  ticketIds: string[]
): Promise<{ success: boolean; error: Error | null }> {
  if (!ticketIds || ticketIds.length === 0 || !isSupabaseConfigured) {
    return { success: true, error: null };
  }
  try {
    const { error } = await supabase
      .from('reports')
      .delete()
      .in('id', ticketIds);

    if (error) {
      return { success: false, error: new Error('Failed to delete report records') };
    }
    return { success: true, error: null };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err : new Error('Database unreachable') };
  }
}

// Delete single report from Supabase
export async function deleteReportFromSupabase(
  ticketId: string
): Promise<{ success: boolean; error: Error | null }> {
  if (!ticketId) return { success: true, error: null };
  return deleteReportsFromSupabase([ticketId]);
}

// Subscribe to real-time changes on public.reports
export function subscribeToReportsRealtime(onDatabaseChange: () => void): () => void {
  if (!isSupabaseConfigured) {
    return () => {};
  }
  try {
    const channel = supabase
      .channel('public:reports')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'reports' },
        () => {
          onDatabaseChange();
        }
      )
      .subscribe((status) => {
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          // Soft notice, falls back to polling or local state
        }
      });

    return () => {
      try {
        supabase.removeChannel(channel);
      } catch {}
    };
  } catch {
    return () => {};
  }
}
