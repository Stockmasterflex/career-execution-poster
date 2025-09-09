-- Create user_plans table
CREATE TABLE IF NOT EXISTS user_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create daily_nonnegotiables table
CREATE TABLE IF NOT EXISTS daily_nonnegotiables (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  time_of_day TEXT CHECK (time_of_day IN ('morning', 'evening')) NOT NULL,
  item TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create kpis table
CREATE TABLE IF NOT EXISTS kpis (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  phase INTEGER NOT NULL,
  key TEXT NOT NULL,
  label TEXT NOT NULL,
  target NUMERIC NOT NULL,
  current NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create companies table
CREATE TABLE IF NOT EXISTS companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  tier TEXT NOT NULL,
  status TEXT CHECK (status IN ('lead', 'applied', 'interview', 'offer', 'rejected')) DEFAULT 'lead',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create daily_tasks table (per-day completions)
CREATE TABLE IF NOT EXISTS daily_tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  item_id UUID REFERENCES daily_nonnegotiables(id) ON DELETE CASCADE,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date, item_id)
);

-- Create schedule_blocks table
CREATE TABLE IF NOT EXISTS schedule_blocks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  day INTEGER CHECK (day >= 0 AND day <= 6) NOT NULL, -- 0=Sunday, 1=Monday, etc.
  start TEXT NOT NULL, -- "6:30 AM"
  "end" TEXT NOT NULL, -- "1:00 PM"
  tag TEXT CHECK (tag IN ('gym', 'market', 'study', 'network', 'content', 'meal', 'family')) NOT NULL,
  title TEXT NOT NULL,
  details TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create success_metrics table
CREATE TABLE IF NOT EXISTS success_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  phase INTEGER NOT NULL,
  area TEXT NOT NULL,
  bullets TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create milestones table
CREATE TABLE IF NOT EXISTS milestones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  level INTEGER NOT NULL,
  name TEXT NOT NULL,
  bullets TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE user_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_nonnegotiables ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE kpis ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE success_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_plans
CREATE POLICY "Users can view their own plans" ON user_plans
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own plans" ON user_plans
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own plans" ON user_plans
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for daily_nonnegotiables
CREATE POLICY "Users can view their own daily_nonnegotiables" ON daily_nonnegotiables
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own daily_nonnegotiables" ON daily_nonnegotiables
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily_nonnegotiables" ON daily_nonnegotiables
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own daily_nonnegotiables" ON daily_nonnegotiables
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for daily_tasks
CREATE POLICY "Users can view their own daily_tasks" ON daily_tasks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own daily_tasks" ON daily_tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily_tasks" ON daily_tasks
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own daily_tasks" ON daily_tasks
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for kpis
CREATE POLICY "Users can view their own kpis" ON kpis
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own kpis" ON kpis
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own kpis" ON kpis
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own kpis" ON kpis
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for companies
CREATE POLICY "Users can view their own companies" ON companies
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own companies" ON companies
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own companies" ON companies
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own companies" ON companies
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for schedule_blocks
CREATE POLICY "Users can view their own schedule_blocks" ON schedule_blocks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own schedule_blocks" ON schedule_blocks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own schedule_blocks" ON schedule_blocks
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own schedule_blocks" ON schedule_blocks
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for success_metrics
CREATE POLICY "Users can view their own success_metrics" ON success_metrics
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own success_metrics" ON success_metrics
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own success_metrics" ON success_metrics
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own success_metrics" ON success_metrics
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for milestones
CREATE POLICY "Users can view their own milestones" ON milestones
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own milestones" ON milestones
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own milestones" ON milestones
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own milestones" ON milestones
  FOR DELETE USING (auth.uid() = user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_user_plans_updated_at BEFORE UPDATE ON user_plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_nonnegotiables_updated_at BEFORE UPDATE ON daily_nonnegotiables
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_tasks_updated_at BEFORE UPDATE ON daily_tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_kpis_updated_at BEFORE UPDATE ON kpis
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_schedule_blocks_updated_at BEFORE UPDATE ON schedule_blocks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_success_metrics_updated_at BEFORE UPDATE ON success_metrics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_milestones_updated_at BEFORE UPDATE ON milestones
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to set focus for a specific date
CREATE OR REPLACE FUNCTION public.set_focus_for_date(p_user_id uuid, p_date text, p_text text) 
RETURNS void AS $$
BEGIN
  INSERT INTO user_plans(user_id, plan_data)
    VALUES (p_user_id, jsonb_build_object('focus', jsonb_build_object(p_date, p_text)))
  ON CONFLICT (user_id) DO UPDATE
    SET plan_data = COALESCE(user_plans.plan_data, '{}'::jsonb) || jsonb_build_object(
      'focus', COALESCE(user_plans.plan_data->'focus','{}'::jsonb) || jsonb_build_object(p_date, p_text)
    );
END; 
$$ LANGUAGE plpgsql;
