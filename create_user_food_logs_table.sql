-- Create user_food_logs table for storing logged food entries
CREATE TABLE IF NOT EXISTS user_food_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    food_name TEXT NOT NULL,
    emoji TEXT NOT NULL DEFAULT '🍽️',
    category TEXT NOT NULL DEFAULT 'other',
    portion_size TEXT NOT NULL,
    quantity DECIMAL(10,2) NOT NULL DEFAULT 1,
    calories DECIMAL(10,2) NOT NULL DEFAULT 0,
    protein_g DECIMAL(10,2) NOT NULL DEFAULT 0,
    carbs_g DECIMAL(10,2) NOT NULL DEFAULT 0,
    fat_g DECIMAL(10,2) NOT NULL DEFAULT 0,
    glycemic_load DECIMAL(10,2) NOT NULL DEFAULT 0,
    logged_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    logged_date DATE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_food_logs_user_id ON user_food_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_user_food_logs_logged_date ON user_food_logs(logged_date);
CREATE INDEX IF NOT EXISTS idx_user_food_logs_logged_at ON user_food_logs(logged_at);
CREATE INDEX IF NOT EXISTS idx_user_food_logs_date_range ON user_food_logs(logged_date, logged_at);
CREATE INDEX IF NOT EXISTS idx_user_food_logs_user_date ON user_food_logs(user_id, logged_date);

-- Add Row Level Security (RLS) for user data isolation
ALTER TABLE user_food_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user data isolation
CREATE POLICY "Users can only access their own food logs" ON user_food_logs
    FOR ALL 
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Create policy for service role (for administrative access)
CREATE POLICY "Service role can access all food logs" ON user_food_logs
    FOR ALL 
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Note: Sample data removed for production use
-- Each user will have their own isolated data