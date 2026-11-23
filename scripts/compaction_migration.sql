-- =========================================================================
-- BRO AI — 90-Day Zero-Cost PostgreSQL Compaction Migration
-- Purpose: Guarantees Supabase Cloud PostgreSQL permanently stays within
--          the 500 MB Free Tier ($0.00 Forever).
-- =========================================================================

-- 1. Create a lightweight daily summary table for historical records older than 90 days
CREATE TABLE IF NOT EXISTS public.price_history_daily (
    id BIGSERIAL PRIMARY KEY,
    product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    store TEXT NOT NULL,
    price_open NUMERIC NOT NULL,
    price_high NUMERIC NOT NULL,
    price_low NUMERIC NOT NULL,
    price_close NUMERIC NOT NULL,
    price_avg NUMERIC NOT NULL,
    sample_count INT NOT NULL DEFAULT 1,
    day_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(product_id, store, day_date)
);

-- Index for instant retrieval by product and date
CREATE INDEX IF NOT EXISTS idx_price_history_daily_product_day 
ON public.price_history_daily (product_id, day_date DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.price_history_daily ENABLE ROW LEVEL SECURITY;

-- Allow public read access to daily price summaries
DROP POLICY IF EXISTS "Allow public read access to price_history_daily" ON public.price_history_daily;
CREATE POLICY "Allow public read access to price_history_daily"
ON public.price_history_daily FOR SELECT
TO anon, authenticated
USING (true);

-- 2. Compaction Stored Procedure
CREATE OR REPLACE FUNCTION public.compact_old_price_history(retention_days INT DEFAULT 90)
RETURNS TABLE(archived_count BIGINT, deleted_count BIGINT) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    cutoff_timestamp TIMESTAMPTZ := NOW() - (retention_days || ' days')::INTERVAL;
    rows_archived BIGINT := 0;
    rows_deleted BIGINT := 0;
BEGIN
    -- Step A: Aggregate raw hourly ticks older than retention threshold into daily summaries
    WITH aggregated_data AS (
        SELECT 
            product_id,
            store,
            recorded_at::DATE AS day_date,
            (ARRAY_AGG(price ORDER BY recorded_at ASC))[1] AS price_open,
            MAX(price) AS price_high,
            MIN(price) AS price_low,
            (ARRAY_AGG(price ORDER BY recorded_at DESC))[1] AS price_close,
            ROUND(AVG(price)) AS price_avg,
            COUNT(*) AS sample_count
        FROM public.price_history
        WHERE recorded_at < cutoff_timestamp
        GROUP BY product_id, store, recorded_at::DATE
    ),
    inserted_summaries AS (
        INSERT INTO public.price_history_daily (
            product_id, store, day_date, price_open, price_high, price_low, price_close, price_avg, sample_count
        )
        SELECT 
            product_id, store, day_date, price_open, price_high, price_low, price_close, price_avg, sample_count
        FROM aggregated_data
        ON CONFLICT (product_id, store, day_date) 
        DO UPDATE SET
            price_high = GREATEST(public.price_history_daily.price_high, EXCLUDED.price_high),
            price_low = LEAST(public.price_history_daily.price_low, EXCLUDED.price_low),
            price_close = EXCLUDED.price_close,
            price_avg = EXCLUDED.price_avg,
            sample_count = public.price_history_daily.sample_count + EXCLUDED.sample_count
        RETURNING 1
    )
    SELECT COUNT(*) INTO rows_archived FROM inserted_summaries;

    -- Step B: Purge the raw granular rows older than retention threshold
    WITH deleted_rows AS (
        DELETE FROM public.price_history
        WHERE recorded_at < cutoff_timestamp
        RETURNING 1
    )
    SELECT COUNT(*) INTO rows_deleted FROM deleted_rows;

    -- Step C: Prune anonymous telemetry search records older than 60 days
    DELETE FROM public.ride_searches
    WHERE created_at < (NOW() - INTERVAL '60 days');

    RETURN QUERY SELECT rows_archived, rows_deleted;
END;
$$;

-- Grant execution to service role and anon/authenticated
GRANT EXECUTE ON FUNCTION public.compact_old_price_history(INT) TO anon, authenticated, service_role;
