-- Migration: Create user_profiles table
-- Date: 2025-11-25
-- Description: Create user profiles table to store onboarding data and calculated nutritional targets

-- Create the user_profiles table
CREATE TABLE user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Personal Info
  gender VARCHAR(10) NOT NULL,
  age INTEGER NOT NULL,
  height_cm NUMERIC(5,2) NOT NULL,
  weight_kg NUMERIC(5,2) NOT NULL,
  
  -- Activity & Goals
  activity_level VARCHAR(20) NOT NULL,
  fitness_goal VARCHAR(20) NOT NULL,
  
  -- Calculated Values
  daily_calories_target INTEGER NOT NULL,
  bmr NUMERIC(8,2),
  tdee NUMERIC(8,2),
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(user_id),
  CHECK (gender IN ('male', 'female')),
  CHECK (age > 0 AND age < 150),
  CHECK (height_cm > 50 AND height_cm < 300),
  CHECK (weight_kg > 20 AND weight_kg < 500),
  CHECK (activity_level IN ('sedentary', 'light', 'moderate', 'active', 'very-active')),
  CHECK (fitness_goal IN ('lose', 'maintain', 'gain'))
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own profile" ON user_profiles
  FOR DELETE USING (auth.uid() = user_id);

-- Create function for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Create trigger for auto-updating updated_at
CREATE TRIGGER update_user_profiles_updated_at 
  BEFORE UPDATE ON user_profiles 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Add helpful comment
COMMENT ON TABLE user_profiles IS 'Stores user onboarding data including physical stats, activity level, goals, and calculated calorie targets';