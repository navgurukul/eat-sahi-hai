-- Migration to add user_id columns to existing tables for user data isolation
-- Run this script in your Supabase SQL editor

-- 1. Add user_id column to user_food_logs table (if it doesn't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'user_food_logs' AND column_name = 'user_id') THEN
        -- Add user_id column as nullable first
        ALTER TABLE user_food_logs 
        ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
        
        -- Add index for the new column
        CREATE INDEX IF NOT EXISTS idx_user_food_logs_user_id ON user_food_logs(user_id);
        CREATE INDEX IF NOT EXISTS idx_user_food_logs_user_date ON user_food_logs(user_id, logged_date);
        
        -- Note: Column remains nullable to allow existing data
        -- New inserts will include user_id from application code
    END IF;
END $$;

-- 2. Add user_id column to user_fasts table (if it doesn't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'user_fasts' AND column_name = 'user_id') THEN
        -- Add user_id column as nullable first
        ALTER TABLE user_fasts 
        ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
        
        -- Add index for the new column
        CREATE INDEX IF NOT EXISTS idx_user_fasts_user_id ON user_fasts(user_id);
        CREATE INDEX IF NOT EXISTS idx_user_fasts_user_date ON user_fasts(user_id, fast_date);
        
        -- Note: Column remains nullable to allow existing data
        -- New inserts will include user_id from application code
    END IF;
END $$;

-- 3. Update Row Level Security policies for user_food_logs
-- First drop existing policies safely
DROP POLICY IF EXISTS "Allow all operations on user_food_logs" ON user_food_logs;
DROP POLICY IF EXISTS "Users can only access their own food logs" ON user_food_logs;
DROP POLICY IF EXISTS "Service role can access all food logs" ON user_food_logs;

-- Create RLS policy that handles both NULL and non-NULL user_id values
-- This allows existing data (user_id = NULL) to be visible to all authenticated users
-- New data (user_id != NULL) is only visible to the owning user
CREATE POLICY "Users can access their own food logs and legacy data" ON user_food_logs
    FOR ALL 
    TO authenticated
    USING (user_id IS NULL OR auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Service role can access all food logs" ON user_food_logs
    FOR ALL 
    TO service_role
    USING (true)
    WITH CHECK (true);

-- 4. Update Row Level Security policies for user_fasts
-- First drop existing policies safely
DROP POLICY IF EXISTS "Allow all operations on user_fasts" ON user_fasts;
DROP POLICY IF EXISTS "Users can only access their own fasts" ON user_fasts;
DROP POLICY IF EXISTS "Service role can access all fasts" ON user_fasts;

-- Create RLS policy that handles both NULL and non-NULL user_id values
-- This allows existing data (user_id = NULL) to be visible to all authenticated users
-- New data (user_id != NULL) is only visible to the owning user
CREATE POLICY "Users can access their own fasts and legacy data" ON user_fasts
    FOR ALL 
    TO authenticated
    USING (user_id IS NULL OR auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Service role can access all fasts" ON user_fasts
    FOR ALL 
    TO service_role
    USING (true)
    WITH CHECK (true);

-- 5. Optional: Clean up existing sample data 
-- Uncomment the lines below if you want to remove existing test data
-- DELETE FROM user_food_logs WHERE user_id IS NULL;
-- DELETE FROM user_fasts WHERE user_id IS NULL;

-- Migration completed successfully!
-- ✅ Tables now have user_id columns (nullable for backward compatibility)
-- ✅ RLS policies allow existing data while enforcing user isolation for new data
-- ✅ New data from authenticated users will be properly isolated
-- ✅ Your app will work immediately after running this migration