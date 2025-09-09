-- Create user_fasts table for storing fast logging entries
CREATE TABLE IF NOT EXISTS user_fasts (
    id BIGSERIAL PRIMARY KEY,
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
CREATE INDEX IF NOT EXISTS idx_user_fasts_fast_date ON user_fasts(fast_date);
CREATE INDEX IF NOT EXISTS idx_user_fasts_start_time ON user_fasts(start_time);
CREATE INDEX IF NOT EXISTS idx_user_fasts_is_active ON user_fasts(is_active);
CREATE INDEX IF NOT EXISTS idx_user_fasts_date_range ON user_fasts(fast_date, start_time);

-- Add Row Level Security (RLS) - Note: You may want to customize this based on your auth setup
ALTER TABLE user_fasts ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for now (you can restrict this later with user authentication)
CREATE POLICY "Allow all operations on user_fasts" ON user_fasts
    FOR ALL 
    TO anon, authenticated
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

-- Add some sample data (optional - remove this section if you don't want sample data)
INSERT INTO user_fasts (
    fast_date, start_time, end_time, duration_minutes, fast_type, notes
) VALUES 
    (CURRENT_DATE - INTERVAL '2 days', 
     CURRENT_DATE - INTERVAL '2 days' + INTERVAL '22 hours', 
     CURRENT_DATE - INTERVAL '1 day' + INTERVAL '14 hours', 
     960, 'intermittent', 'Completed 16:8 fast'),
    (CURRENT_DATE - INTERVAL '1 day', 
     CURRENT_DATE - INTERVAL '1 day' + INTERVAL '20 hours', 
     CURRENT_DATE + INTERVAL '12 hours', 
     720, 'intermittent', 'Good 12 hour fast')
ON CONFLICT DO NOTHING;