-- Enable RLS on all tables
ALTER TABLE daily_nonnegotiables ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE kpis ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE success_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_plans ENABLE ROW LEVEL SECURITY;

-- Daily Non-Negotiables policies
CREATE POLICY "Users can view own daily_nonnegotiables" ON daily_nonnegotiables
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own daily_nonnegotiables" ON daily_nonnegotiables
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own daily_nonnegotiables" ON daily_nonnegotiables
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own daily_nonnegotiables" ON daily_nonnegotiables
  FOR DELETE USING (auth.uid() = user_id);

-- Daily Tasks policies
CREATE POLICY "Users can view own daily_tasks" ON daily_tasks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own daily_tasks" ON daily_tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own daily_tasks" ON daily_tasks
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own daily_tasks" ON daily_tasks
  FOR DELETE USING (auth.uid() = user_id);

-- KPIs policies
CREATE POLICY "Users can view own kpis" ON kpis
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own kpis" ON kpis
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own kpis" ON kpis
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own kpis" ON kpis
  FOR DELETE USING (auth.uid() = user_id);

-- Companies policies
CREATE POLICY "Users can view own companies" ON companies
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own companies" ON companies
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own companies" ON companies
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own companies" ON companies
  FOR DELETE USING (auth.uid() = user_id);

-- Schedule Blocks policies
CREATE POLICY "Users can view own schedule_blocks" ON schedule_blocks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own schedule_blocks" ON schedule_blocks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own schedule_blocks" ON schedule_blocks
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own schedule_blocks" ON schedule_blocks
  FOR DELETE USING (auth.uid() = user_id);

-- Success Metrics policies
CREATE POLICY "Users can view own success_metrics" ON success_metrics
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own success_metrics" ON success_metrics
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own success_metrics" ON success_metrics
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own success_metrics" ON success_metrics
  FOR DELETE USING (auth.uid() = user_id);

-- Milestones policies
CREATE POLICY "Users can view own milestones" ON milestones
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own milestones" ON milestones
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own milestones" ON milestones
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own milestones" ON milestones
  FOR DELETE USING (auth.uid() = user_id);

-- User Plans policies
CREATE POLICY "Users can view own user_plans" ON user_plans
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own user_plans" ON user_plans
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own user_plans" ON user_plans
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own user_plans" ON user_plans
  FOR DELETE USING (auth.uid() = user_id);