-- Create user_fasts table for storing fast logging entries
CREATE TABLE IF NOT EXISTS user_fasts (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    fast_date DATE NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ,
    duration_minutes INTEGER,
    fast_type TEXT DEFAULT 'intermittent',
    notes TEXT,
    is_active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_fasts_user_id ON user_fasts(user_id);
CREATE INDEX IF NOT EXISTS idx_user_fasts_fast_date ON user_fasts(fast_date);
CREATE INDEX IF NOT EXISTS idx_user_fasts_start_time ON user_fasts(start_time);
CREATE INDEX IF NOT EXISTS idx_user_fasts_is_active ON user_fasts(is_active);
CREATE INDEX IF NOT EXISTS idx_user_fasts_date_range ON user_fasts(fast_date, start_time);
CREATE INDEX IF NOT EXISTS idx_user_fasts_user_date ON user_fasts(user_id, fast_date);

-- Add Row Level Security (RLS) for user data isolation
ALTER TABLE user_fasts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user data isolation
CREATE POLICY "Users can only access their own fasts" ON user_fasts
    FOR ALL 
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Create policy for service role (for administrative access)
CREATE POLICY "Service role can access all fasts" ON user_fasts
    FOR ALL 
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_fasts_updated_at BEFORE UPDATE ON user_fasts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Note: Sample data removed for production use
-- Each user will have their own isolated data