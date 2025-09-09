import { isMock, storage, todayKey } from '@/src/lib/runtime';
import { createClient } from '@/src/lib/supabase-browser';

type DailyTask = { 
  id: string; 
  date: string; // YYYY-MM-DD
  item_id: string;
  completed: boolean;
  completed_at?: string;
  created_at?: string;
  updated_at?: string;
};

const mock = {
  list(userId: string, date = todayKey()): DailyTask[] { 
    return storage.get<DailyTask[]>(`daily_tasks:${userId}:${date}`, []); 
  },
  create(userId: string, payload: Omit<DailyTask, 'id' | 'created_at' | 'updated_at'>) {
    const tasks = mock.list(userId, payload.date);
    const newTask: DailyTask = {
      ...payload,
      id: `task_${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    tasks.push(newTask);
    storage.set(`daily_tasks:${userId}:${payload.date}`, tasks);
    return newTask;
  },
  update(userId: string, id: string, partial: Partial<Omit<DailyTask, 'id' | 'created_at'>>) {
    const tasks = mock.list(userId);
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Task not found');
    tasks[index] = { ...tasks[index], ...partial, updated_at: new Date().toISOString() };
    storage.set(`daily_tasks:${userId}:${tasks[index].date}`, tasks);
    return tasks[index];
  },
  remove(userId: string, id: string) {
    const tasks = mock.list(userId);
    const taskToRemove = tasks.find(t => t.id === id);
    if (!taskToRemove) return;
    const filtered = tasks.filter(t => t.id !== id);
    storage.set(`daily_tasks:${userId}:${taskToRemove.date}`, filtered);
  },
  toggle(userId: string, itemId: string, date = todayKey()) {
    const tasks = mock.list(userId, date);
    const existingTask = tasks.find(t => t.item_id === itemId);
    if (existingTask) {
      const updated = { ...existingTask, completed: !existingTask.completed };
      if (updated.completed) {
        updated.completed_at = new Date().toISOString();
      } else {
        updated.completed_at = undefined;
      }
      return mock.update(userId, existingTask.id, updated);
    } else {
      return mock.create(userId, {
        date,
        item_id: itemId,
        completed: true,
        completed_at: new Date().toISOString(),
      });
    }
  },
};

const db = {
  async list(userId: string, date = todayKey()): Promise<DailyTask[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('daily_tasks')
      .select('*')
      .eq('user_id', userId)
      .eq('date', date)
      .order('created_at', { ascending: true });
    if (error) throw error;
    return data as DailyTask[];
  },
  async create(userId: string, payload: Omit<DailyTask, 'id' | 'created_at' | 'updated_at'>) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('daily_tasks')
      .insert({ ...payload, user_id: userId })
      .select()
      .single();
    if (error) throw error;
    return data as DailyTask;
  },
  async update(userId: string, id: string, partial: Partial<Omit<DailyTask, 'id' | 'created_at'>>) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('daily_tasks')
      .update(partial)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();
    if (error) throw error;
    return data as DailyTask;
  },
  async remove(userId: string, id: string) {
    const supabase = createClient();
    const { error } = await supabase
      .from('daily_tasks')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);
    if (error) throw error;
  },
  async toggle(userId: string, itemId: string, date = todayKey()) {
    const supabase = createClient();
    // Check if task exists
    const { data: existing } = await supabase
      .from('daily_tasks')
      .select('*')
      .eq('user_id', userId)
      .eq('item_id', itemId)
      .eq('date', date)
      .single();

    if (existing) {
      // Toggle existing task
      const completed = !existing.completed;
      const { data, error } = await supabase
        .from('daily_tasks')
        .update({ 
          completed, 
          completed_at: completed ? new Date().toISOString() : null 
        })
        .eq('id', existing.id)
        .eq('user_id', userId)
        .select()
        .single();
      if (error) throw error;
      return data as DailyTask;
    } else {
      // Create new task
      const { data, error } = await supabase
        .from('daily_tasks')
        .insert({ 
          user_id: userId, 
          date, 
          item_id: itemId, 
          completed: true, 
          completed_at: new Date().toISOString() 
        })
        .select()
        .single();
      if (error) throw error;
      return data as DailyTask;
    }
  },
};

export const dailyTasksRepository = {
  async list(userId: string, date = todayKey()) { return isMock ? mock.list(userId, date) : db.list(userId, date); },
  async create(userId: string, payload: Omit<DailyTask, 'id' | 'created_at' | 'updated_at'>) {
    return isMock ? mock.create(userId, payload) : db.create(userId, payload);
  },
  async update(userId: string, id: string, partial: Partial<Omit<DailyTask, 'id' | 'created_at'>>) {
    return isMock ? mock.update(userId, id, partial) : db.update(userId, id, partial);
  },
  async remove(userId: string, id: string) {
    return isMock ? mock.remove(userId, id) : db.remove(userId, id);
  },
  async toggle(userId: string, itemId: string, date = todayKey()) {
    return isMock ? mock.toggle(userId, itemId, date) : db.toggle(userId, itemId, date);
  },
};


