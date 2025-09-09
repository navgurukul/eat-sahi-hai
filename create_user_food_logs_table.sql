-- Create user_food_logs table for storing logged food entries
CREATE TABLE IF NOT EXISTS user_food_logs (
    id BIGSERIAL PRIMARY KEY,
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
CREATE INDEX IF NOT EXISTS idx_user_food_logs_logged_date ON user_food_logs(logged_date);
CREATE INDEX IF NOT EXISTS idx_user_food_logs_logged_at ON user_food_logs(logged_at);
CREATE INDEX IF NOT EXISTS idx_user_food_logs_date_range ON user_food_logs(logged_date, logged_at);

-- Add Row Level Security (RLS) - Note: You may want to customize this based on your auth setup
ALTER TABLE user_food_logs ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for now (you can restrict this later with user authentication)
CREATE POLICY "Allow all operations on user_food_logs" ON user_food_logs
    FOR ALL 
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

-- Add some sample data (optional - remove this section if you don't want sample data)
INSERT INTO user_food_logs (
    food_name, emoji, category, portion_size, quantity, 
    calories, protein_g, carbs_g, fat_g, glycemic_load, 
    logged_date
) VALUES 
    ('Green Juice (without fibre)', '🥤', 'beverage', '1 glass', 1, 10, 0.1, 1.5, 0.4, 0.1, CURRENT_DATE),
    ('Wheat Roti', '🫓', 'staple', '1 medium', 2, 160, 6, 30, 2, 60, CURRENT_DATE - INTERVAL '1 day'),
    ('Dal (Moong)', '🫘', 'protein', '1 cup cooked', 1, 212, 14, 36, 1, 25, CURRENT_DATE - INTERVAL '1 day')
ON CONFLICT DO NOTHING;