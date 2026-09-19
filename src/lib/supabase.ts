import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ReportTicket } from '../types';

// Supabase project credentials for project ardwojiczhdrbdpaytch
const DEFAULT_SUPABASE_URL = 'https://ardwojiczhdrbdpaytch.supabase.co';
const DEFAULT_ANON_KEY = 'sb_publishable_lRVf-2R511Ark4itu-mjhA_4nap3BDx';

function getValidUrl(): string {
  try {
    const candidate = import.meta.env?.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
    if (typeof candidate === 'string' && candidate.trim().startsWith('http')) {
      new URL(candidate.trim());
      return candidate.trim();
    }
  } catch {
    // fallback
  }
  return DEFAULT_SUPABASE_URL;
}

function getValidKey(): string {
  const candidate = import.meta.env?.VITE_SUPABASE_ANON_KEY || DEFAULT_ANON_KEY;
  if (typeof candidate === 'string' && candidate.trim().length > 10) {
    return candidate.trim();
  }
  return DEFAULT_ANON_KEY;
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
  try {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .order('reported_at', { ascending: false });

    if (error) {
      console.warn('[Supabase fetchReports notice]:', error.message);
      return { data: null, error: new Error(error.message) };
    }

    const tickets: ReportTicket[] = (data || []).map((row: DbReportRow) => fromDbRow(row));
    return { data: tickets, error: null };
  } catch (err: unknown) {
    console.error('[Supabase fetchReports exception]:', err);
    return { data: null, error: err instanceof Error ? err : new Error(String(err)) };
  }
}

// Insert or upsert single report into Supabase
export async function insertReportToSupabase(
  ticket: ReportTicket
): Promise<{ success: boolean; error: Error | null; row?: DbReportRow }> {
  try {
    const payload = toDbRow(ticket);
    const { data, error } = await supabase
      .from('reports')
      .upsert(payload, { onConflict: 'id' })
      .select()
      .maybeSingle();

    if (error) {
      console.error('[Supabase insertReport error]:', error);
      return { success: false, error: new Error(error.message) };
    }
    return { success: true, error: null, row: data as DbReportRow | undefined };
  } catch (err: unknown) {
    console.error('[Supabase insertReport exception]:', err);
    return { success: false, error: err instanceof Error ? err : new Error(String(err)) };
  }
}

// Bulk sync tickets to Supabase (e.g., seeding initial local reports or manual sync)
export async function syncAllLocalTicketsToSupabase(
  tickets: ReportTicket[]
): Promise<{ count: number; error: Error | null }> {
  if (!tickets || tickets.length === 0) {
    return { count: 0, error: null };
  }
  try {
    const payloads = tickets.map(toDbRow);
    const { data, error } = await supabase
      .from('reports')
      .upsert(payloads, { onConflict: 'id' })
      .select();

    if (error) {
      console.error('[Supabase bulk sync error]:', error);
      return { count: 0, error: new Error(error.message) };
    }
    return { count: data?.length ?? payloads.length, error: null };
  } catch (err: unknown) {
    console.error('[Supabase bulk sync exception]:', err);
    return { count: 0, error: err instanceof Error ? err : new Error(String(err)) };
  }
}

// Update report status in Supabase (with fallback full ticket upsert)
export async function updateReportStatusInSupabase(
  ticketId: string, 
  status: ReportTicket['status'],
  fullTicket?: ReportTicket
): Promise<{ success: boolean; error: Error | null }> {
  try {
    if (fullTicket) {
      const payload = toDbRow({ ...fullTicket, status });
      const { error } = await supabase
        .from('reports')
        .upsert(payload, { onConflict: 'id' });

      if (error) {
        console.error('[Supabase updateReportStatus upsert error]:', error);
        return { success: false, error: new Error(error.message) };
      }
      return { success: true, error: null };
    }

    const { error } = await supabase
      .from('reports')
      .update({ status })
      .eq('id', ticketId);

    if (error) {
      console.error('[Supabase updateReportStatus error]:', error);
      return { success: false, error: new Error(error.message) };
    }
    return { success: true, error: null };
  } catch (err: unknown) {
    console.error('[Supabase updateReportStatus exception]:', err);
    return { success: false, error: err instanceof Error ? err : new Error(String(err)) };
  }
}

// Delete report from Supabase
export async function deleteReportFromSupabase(
  ticketId: string
): Promise<{ success: boolean; error: Error | null }> {
  try {
    const { error } = await supabase
      .from('reports')
      .delete()
      .eq('id', ticketId);

    if (error) {
      console.error('[Supabase deleteReport error]:', error);
      return { success: false, error: new Error(error.message) };
    }
    return { success: true, error: null };
  } catch (err: unknown) {
    console.error('[Supabase deleteReport exception]:', err);
    return { success: false, error: err instanceof Error ? err : new Error(String(err)) };
  }
}

// Subscribe to real-time changes on public.reports
export function subscribeToReportsRealtime(onDatabaseChange: () => void): () => void {
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
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  } catch {
    return () => {};
  }
}
