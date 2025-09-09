'use client';
import { useState, useEffect } from 'react';
import { nonnegRepository } from '../../src/data/nonneg';
import { dailyTasksRepository } from '../../src/data/dailyTasks';
import { todayKey } from '../../src/lib/runtime';

type NonNegotiable = { 
  id: string; 
  time_of_day: 'morning' | 'evening';
  item: string;
  duration_minutes: number;
  order_index: number;
  created_at?: string;
  updated_at?: string;
};

type DailyTask = { 
  id: string; 
  date: string;
  item_id: string;
  completed: boolean;
  completed_at?: string;
  created_at?: string;
  updated_at?: string;
};

interface DailyNonNegotiablesProps {
  userId: string;
}

export default function DailyNonNegotiables({ userId }: DailyNonNegotiablesProps) {
  const [nonnegs, setNonnegs] = useState<NonNegotiable[]>([]);
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    loadData();
  }, [userId]);

  const loadData = async () => {
    try {
      const [nonnegsData, tasksData] = await Promise.all([
        nonnegRepository.list(userId),
        dailyTasksRepository.list(userId)
      ]);
      setNonnegs(nonnegsData);
      setDailyTasks(tasksData);
    } catch (error) {
      console.error('Failed to load non-negotiables:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTask = async (itemId: string) => {
    try {
      await dailyTasksRepository.toggle(userId, itemId);
      setDailyTasks(prev => {
        const existing = prev.find(t => t.item_id === itemId);
        if (existing) {
          return prev.map(t => 
            t.item_id === itemId 
              ? { ...t, completed: !t.completed, completed_at: !t.completed ? new Date().toISOString() : undefined }
              : t
          );
        } else {
          return [...prev, {
            id: `task_${Date.now()}`,
            date: todayKey(),
            item_id: itemId,
            completed: true,
            completed_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }];
        }
      });
    } catch (error) {
      console.error('Failed to toggle task:', error);
    }
  };

  const isCompleted = (itemId: string) => {
    return dailyTasks.find(t => t.item_id === itemId)?.completed || false;
  };

  if (!userId) return null;

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Daily Non-Negotiables</h2>
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const morningTasks = nonnegs.filter(n => n.time_of_day === 'morning');
  const eveningTasks = nonnegs.filter(n => n.time_of_day === 'evening');

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Daily Non-Negotiables</h2>
        <div className="text-sm text-gray-500">
          {morningTasks.filter(t => isCompleted(t.id)).length + eveningTasks.filter(t => isCompleted(t.id)).length} / {morningTasks.length + eveningTasks.length} completed
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
          <h3 className="text-lg font-semibold mb-4 text-blue-700 flex items-center">
            🌅 Morning
            <span className="ml-2 text-sm bg-blue-200 text-blue-800 px-2 py-1 rounded-full">
              {morningTasks.filter(t => isCompleted(t.id)).length}/{morningTasks.length}
            </span>
          </h3>
          <div className="space-y-3">
            {morningTasks.map((task) => (
              <label key={task.id} className="group flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-white/50 transition-colors">
                <input
                  type="checkbox"
                  checked={isCompleted(task.id)}
                  onChange={() => toggleTask(task.id)}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 focus:ring-2"
                />
                <span className={`text-sm flex-1 ${isCompleted(task.id) ? 'line-through text-gray-500' : 'text-gray-700 group-hover:text-gray-900'}`}>
                  {task.item}
                </span>
                {isCompleted(task.id) && (
                  <span className="text-green-500 text-xs">✓</span>
                )}
              </label>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
          <h3 className="text-lg font-semibold mb-4 text-purple-700 flex items-center">
            🌙 Evening
            <span className="ml-2 text-sm bg-purple-200 text-purple-800 px-2 py-1 rounded-full">
              {eveningTasks.filter(t => isCompleted(t.id)).length}/{eveningTasks.length}
            </span>
          </h3>
          <div className="space-y-3">
            {eveningTasks.map((task) => (
              <label key={task.id} className="group flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-white/50 transition-colors">
                <input
                  type="checkbox"
                  checked={isCompleted(task.id)}
                  onChange={() => toggleTask(task.id)}
                  className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500 focus:ring-2"
                />
                <span className={`text-sm flex-1 ${isCompleted(task.id) ? 'line-through text-gray-500' : 'text-gray-700 group-hover:text-gray-900'}`}>
                  {task.item}
                </span>
                {isCompleted(task.id) && (
                  <span className="text-green-500 text-xs">✓</span>
                )}
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}