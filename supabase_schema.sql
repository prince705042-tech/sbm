-- ==============================================================================
-- Swachh Campus - Supabase PostgreSQL Schema
-- Run this in your Supabase project's SQL Editor (https://supabase.com/dashboard)
-- ==============================================================================

-- 1. Create the 'reports' table for issue reporting & SBM admin dashboard
CREATE TABLE IF NOT EXISTS public.reports (
    id TEXT PRIMARY KEY,
    bin_id TEXT NOT NULL,
    bin_name TEXT NOT NULL,
    location_name TEXT NOT NULL,
    issue_type TEXT NOT NULL CHECK (issue_type IN ('overflowing', 'damaged', 'missing', 'smell', 'wrong_waste')),
    details TEXT DEFAULT '',
    reported_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::TEXT, NOW()),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'cleaning_dispatched', 'resolved')),
    reported_by TEXT DEFAULT 'Student',
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::TEXT, NOW())
);

-- 2. Create index on reported_at for faster ordering
CREATE INDEX IF NOT EXISTS idx_reports_reported_at ON public.reports (reported_at DESC);
CREATE INDEX IF NOT EXISTS idx_reports_bin_id ON public.reports (bin_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON public.reports (status);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS Policies for Anonymous / Public Access
-- Allow anyone to view reports
DROP POLICY IF EXISTS "Allow public read access to reports" ON public.reports;
CREATE POLICY "Allow public read access to reports"
    ON public.reports
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- Allow anyone to submit a report ticket
DROP POLICY IF EXISTS "Allow public insert to reports" ON public.reports;
CREATE POLICY "Allow public insert to reports"
    ON public.reports
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Allow updating report ticket status (e.g., dispatch cleaning, resolve)
DROP POLICY IF EXISTS "Allow public update to reports" ON public.reports;
CREATE POLICY "Allow public update to reports"
    ON public.reports
    FOR UPDATE
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

-- Allow deleting resolved reports
DROP POLICY IF EXISTS "Allow public delete to reports" ON public.reports;
CREATE POLICY "Allow public delete to reports"
    ON public.reports
    FOR DELETE
    TO anon, authenticated
    USING (true);

-- 5. Enable Realtime updates (optional, for live changes)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.reports;
  END IF;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- 6. (Optional) Sample Initial Data for Reports
INSERT INTO public.reports (id, bin_id, bin_name, location_name, issue_type, details, reported_at, status, reported_by)
VALUES 
  ('ticket-init-1', 'bin-amphi-1', 'Dry Waste Station #1', 'Open Air Theatre Lawn', 'overflowing', 'Filled with paper cups and food packaging after evening college fest.', NOW() - INTERVAL '4 hours', 'pending', 'Student (SAC Volunteer)'),
  ('ticket-init-2', 'bin-kosi-1', 'Wet Waste SBM Canister #1', 'Kosi Hostel Entrance Gate', 'smell', 'Needs urgent cleaning and sanitization.', NOW() - INTERVAL '1 day', 'cleaning_dispatched', 'Hostel Resident')
ON CONFLICT (id) DO NOTHING;
