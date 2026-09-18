import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ReportTicket } from '../types';

// Supabase project credentials for project ardwojiczhdrbdpaytch
const DEFAULT_SUPABASE_URL = 'https://ardwojiczhdrbdpaytch.supabase.co';
const DEFAULT_ANON_KEY = 'sb_publishable_lRVf-2R511Ark4itu-mjhA_4nap3BDx';

function getValidUrl(): string {
  try {
    const candidate = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
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
  const candidate = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_ANON_KEY;
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

// Convert app ReportTicket to Supabase row format
export function toDbRow(ticket: ReportTicket): DbReportRow {
  return {
    id: ticket.id,
    bin_id: ticket.binId,
    bin_name: ticket.binName,
    location_name: ticket.locationName,
    issue_type: ticket.issueType,
    details: ticket.details || '',
    reported_at: ticket.reportedAt || new Date().toISOString(),
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
      return { data: null, error: new Error(error.message) };
    }

    const tickets: ReportTicket[] = (data || []).map((row: DbReportRow) => fromDbRow(row));
    return { data: tickets, error: null };
  } catch (err: unknown) {
    return { data: null, error: err instanceof Error ? err : new Error(String(err)) };
  }
}

// Insert report into Supabase
export async function insertReportToSupabase(ticket: ReportTicket): Promise<{ success: boolean; error: Error | null }> {
  try {
    const payload = toDbRow(ticket);
    const { error } = await supabase.from('reports').insert([payload]);
    if (error) {
      return { success: false, error: new Error(error.message) };
    }
    return { success: true, error: null };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err : new Error(String(err)) };
  }
}

// Update report status in Supabase
export async function updateReportStatusInSupabase(
  ticketId: string, 
  status: ReportTicket['status']
): Promise<{ success: boolean; error: Error | null }> {
  try {
    const { error } = await supabase
      .from('reports')
      .update({ status })
      .eq('id', ticketId);

    if (error) {
      return { success: false, error: new Error(error.message) };
    }
    return { success: true, error: null };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err : new Error(String(err)) };
  }
}

// Delete report from Supabase
export async function deleteReportFromSupabase(ticketId: string): Promise<{ success: boolean; error: Error | null }> {
  try {
    const { error } = await supabase
      .from('reports')
      .delete()
      .eq('id', ticketId);

    if (error) {
      return { success: false, error: new Error(error.message) };
    }
    return { success: true, error: null };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err : new Error(String(err)) };
  }
}
