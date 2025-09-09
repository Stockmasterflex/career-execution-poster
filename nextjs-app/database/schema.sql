-- Enable RLS
ALTER TABLE IF EXISTS daily_nonnegotiables ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS daily_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS schedule_blocks ENABLE ROW LEVEL SECURITY;

-- Create daily_nonnegotiables table
CREATE TABLE IF NOT EXISTS daily_nonnegotiables (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  time_of_day TEXT NOT NULL CHECK (time_of_day IN ('morning', 'evening')),
  item TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create daily_tasks table
CREATE TABLE IF NOT EXISTS daily_tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  item_id UUID NOT NULL REFERENCES daily_nonnegotiables(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date, item_id)
);

-- Create schedule_blocks table
CREATE TABLE IF NOT EXISTS schedule_blocks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  day INTEGER NOT NULL CHECK (day >= 1 AND day <= 7), -- 1=Monday, 7=Sunday
  start TEXT NOT NULL, -- Format: "HH:MM"
  end TEXT NOT NULL,   -- Format: "HH:MM"
  tag TEXT NOT NULL CHECK (tag IN ('gym', 'market', 'study', 'network', 'content', 'meal', 'family')),
  title TEXT NOT NULL,
  details TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies for daily_nonnegotiables
DROP POLICY IF EXISTS "Users can view their own daily_nonnegotiables" ON daily_nonnegotiables;
CREATE POLICY "Users can view their own daily_nonnegotiables" ON daily_nonnegotiables
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own daily_nonnegotiables" ON daily_nonnegotiables;
CREATE POLICY "Users can insert their own daily_nonnegotiables" ON daily_nonnegotiables
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own daily_nonnegotiables" ON daily_nonnegotiables;
CREATE POLICY "Users can update their own daily_nonnegotiables" ON daily_nonnegotiables
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own daily_nonnegotiables" ON daily_nonnegotiables;
CREATE POLICY "Users can delete their own daily_nonnegotiables" ON daily_nonnegotiables
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for daily_tasks
DROP POLICY IF EXISTS "Users can view their own daily_tasks" ON daily_tasks;
CREATE POLICY "Users can view their own daily_tasks" ON daily_tasks
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own daily_tasks" ON daily_tasks;
CREATE POLICY "Users can insert their own daily_tasks" ON daily_tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own daily_tasks" ON daily_tasks;
CREATE POLICY "Users can update their own daily_tasks" ON daily_tasks
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own daily_tasks" ON daily_tasks;
CREATE POLICY "Users can delete their own daily_tasks" ON daily_tasks
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for schedule_blocks
DROP POLICY IF EXISTS "Users can view their own schedule_blocks" ON schedule_blocks;
CREATE POLICY "Users can view their own schedule_blocks" ON schedule_blocks
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own schedule_blocks" ON schedule_blocks;
CREATE POLICY "Users can insert their own schedule_blocks" ON schedule_blocks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own schedule_blocks" ON schedule_blocks;
CREATE POLICY "Users can update their own schedule_blocks" ON schedule_blocks
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own schedule_blocks" ON schedule_blocks;
CREATE POLICY "Users can delete their own schedule_blocks" ON schedule_blocks
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_daily_nonnegotiables_user_id ON daily_nonnegotiables(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_nonnegotiables_time_of_day ON daily_nonnegotiables(time_of_day);
CREATE INDEX IF NOT EXISTS idx_daily_tasks_user_id ON daily_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_tasks_date ON daily_tasks(date);
CREATE INDEX IF NOT EXISTS idx_schedule_blocks_user_id ON schedule_blocks(user_id);
CREATE INDEX IF NOT EXISTS idx_schedule_blocks_day ON schedule_blocks(day);