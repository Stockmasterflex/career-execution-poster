import { isMock, storage } from '@/src/lib/runtime';
import { createClient } from '@/src/lib/supabase-browser';

type NonNegotiable = { 
  id: string; 
  time_of_day: 'morning' | 'evening';
  item: string;
  duration_minutes: number;
  order_index: number;
  created_at?: string;
  updated_at?: string;
};

type NonNegotiableTemplate = {
  morning: Omit<NonNegotiable, 'id' | 'created_at' | 'updated_at'>[];
  evening: Omit<NonNegotiable, 'id' | 'created_at' | 'updated_at'>[];
};

const mock = {
  list(userId: string): NonNegotiable[] { 
    return storage.get<NonNegotiable[]>(`nonneg:${userId}`, []); 
  },
  getTemplate(userId: string): NonNegotiableTemplate {
    return storage.get<NonNegotiableTemplate>(`nonneg_template:${userId}`, {
      morning: [
        { time_of_day: 'morning', item: 'Market analysis + trade journal', duration_minutes: 25, order_index: 1 },
        { time_of_day: 'morning', item: 'CMT study or skill dev', duration_minutes: 25, order_index: 2 },
        { time_of_day: 'morning', item: 'LinkedIn engagement + content planning', duration_minutes: 10, order_index: 3 },
      ],
      evening: [
        { time_of_day: 'evening', item: 'Close review + tomorrow\'s setup', duration_minutes: 20, order_index: 1 },
        { time_of_day: 'evening', item: 'Outreach or content creation', duration_minutes: 25, order_index: 2 },
        { time_of_day: 'evening', item: 'Goals review + next-day plan', duration_minutes: 15, order_index: 3 },
      ],
    });
  },
  create(userId: string, payload: Omit<NonNegotiable, 'id' | 'created_at' | 'updated_at'>) {
    const items = mock.list(userId);
    const newItem: NonNegotiable = {
      ...payload,
      id: `nonneg_${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    items.push(newItem);
    storage.set(`nonneg:${userId}`, items);
    return newItem;
  },
  update(userId: string, id: string, partial: Partial<Omit<NonNegotiable, 'id' | 'created_at'>>) {
    const items = mock.list(userId);
    const index = items.findIndex(i => i.id === id);
    if (index === -1) throw new Error('Item not found');
    items[index] = { ...items[index], ...partial, updated_at: new Date().toISOString() };
    storage.set(`nonneg:${userId}`, items);
    return items[index];
  },
  remove(userId: string, id: string) {
    const items = mock.list(userId);
    const filtered = items.filter(i => i.id !== id);
    storage.set(`nonneg:${userId}`, filtered);
  },
};

const db = {
  async list(userId: string): Promise<NonNegotiable[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('daily_nonnegotiables')
      .select('*')
      .eq('user_id', userId)
      .order('time_of_day', { ascending: true })
      .order('order_index', { ascending: true });
    if (error) throw error;
    return data as NonNegotiable[];
  },
  async getTemplate(userId: string): Promise<NonNegotiableTemplate> {
    const items = await db.list(userId);
    const template: NonNegotiableTemplate = { morning: [], evening: [] };
    items.forEach(item => {
      template[item.time_of_day].push({
        time_of_day: item.time_of_day,
        item: item.item,
        duration_minutes: item.duration_minutes,
        order_index: item.order_index,
      });
    });
    return template;
  },
  async create(userId: string, payload: Omit<NonNegotiable, 'id' | 'created_at' | 'updated_at'>) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('daily_nonnegotiables')
      .insert({ ...payload, user_id: userId })
      .select()
      .single();
    if (error) throw error;
    return data as NonNegotiable;
  },
  async update(userId: string, id: string, partial: Partial<Omit<NonNegotiable, 'id' | 'created_at'>>) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('daily_nonnegotiables')
      .update(partial)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();
    if (error) throw error;
    return data as NonNegotiable;
  },
  async remove(userId: string, id: string) {
    const supabase = createClient();
    const { error } = await supabase
      .from('daily_nonnegotiables')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);
    if (error) throw error;
  },
};

export const nonnegRepository = {
  async list(userId: string) { return isMock ? mock.list(userId) : db.list(userId); },
  async getTemplate(userId: string) { return isMock ? mock.getTemplate(userId) : db.getTemplate(userId); },
  async create(userId: string, payload: Omit<NonNegotiable, 'id' | 'created_at' | 'updated_at'>) {
    return isMock ? mock.create(userId, payload) : db.create(userId, payload);
  },
  async update(userId: string, id: string, partial: Partial<Omit<NonNegotiable, 'id' | 'created_at'>>) {
    return isMock ? mock.update(userId, id, partial) : db.update(userId, id, partial);
  },
  async remove(userId: string, id: string) {
    return isMock ? mock.remove(userId, id) : db.remove(userId, id);
  },
};


