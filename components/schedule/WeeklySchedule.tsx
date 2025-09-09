'use client';
import { useState, useEffect } from 'react';
import { scheduleRepository } from '../../src/data/schedule';

type ScheduleBlock = { 
  id: string; 
  day: number; // 0=Sunday, 1=Monday, etc.
  start: string; // "6:30 AM"
  end: string; // "1:00 PM"
  tag: 'gym' | 'market' | 'study' | 'network' | 'content' | 'meal' | 'family';
  title: string;
  details?: string;
  created_at?: string;
  updated_at?: string;
};

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const tagColors = {
  gym: 'bg-red-100 text-red-800',
  market: 'bg-blue-100 text-blue-800',
  study: 'bg-green-100 text-green-800',
  network: 'bg-purple-100 text-purple-800',
  content: 'bg-yellow-100 text-yellow-800',
  meal: 'bg-orange-100 text-orange-800',
  family: 'bg-pink-100 text-pink-800',
};

interface WeeklyScheduleProps {
  userId: string;
}

export default function WeeklySchedule({ userId }: WeeklyScheduleProps) {
  const [schedule, setSchedule] = useState<ScheduleBlock[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    day: 1,
    start: '',
    end: '',
    tag: 'study' as const,
    title: '',
    details: '',
  });

  useEffect(() => {
    if (!userId) return;
    loadSchedule();
  }, [userId]);

  const loadSchedule = async () => {
    try {
      const data = await scheduleRepository.list(userId);
      setSchedule(data);
    } catch (error) {
      console.error('Failed to load schedule:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await scheduleRepository.update(userId, editingId, formData);
        setSchedule(prev => prev.map(s => s.id === editingId ? { ...s, ...formData } : s));
        setEditingId(null);
      } else {
        const newBlock = await scheduleRepository.create(userId, formData);
        setSchedule(prev => [...prev, newBlock]);
      }
      setFormData({ day: 1, start: '', end: '', tag: 'study', title: '', details: '' });
      setShowAddForm(false);
    } catch (error) {
      console.error('Failed to save schedule block:', error);
    }
  };

  const handleEdit = (block: ScheduleBlock) => {
    setFormData({
      day: block.day,
      start: block.start,
      end: block.end,
      tag: block.tag,
      title: block.title,
      details: block.details || '',
    });
    setEditingId(block.id);
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this schedule block?')) return;
    try {
      await scheduleRepository.remove(userId, id);
      setSchedule(prev => prev.filter(s => s.id !== id));
    } catch (error) {
      console.error('Failed to delete schedule block:', error);
    }
  };

  if (!userId) return null;

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Weekly Schedule</h2>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const scheduleByDay = schedule.reduce((acc, block) => {
    if (!acc[block.day]) acc[block.day] = [];
    acc[block.day].push(block);
    return acc;
  }, {} as Record<number, ScheduleBlock[]>);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Weekly Schedule</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Add Block
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded-lg bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Day</label>
              <select
                value={formData.day}
                onChange={(e) => setFormData(prev => ({ ...prev, day: parseInt(e.target.value) }))}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                {dayNames.map((day, index) => (
                  <option key={index} value={index}>{day}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tag</label>
              <select
                value={formData.tag}
                onChange={(e) => setFormData(prev => ({ ...prev, tag: e.target.value as ScheduleBlock['tag'] }))}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="gym">Gym</option>
                <option value="market">Market</option>
                <option value="study">Study</option>
                <option value="network">Network</option>
                <option value="content">Content</option>
                <option value="meal">Meal</option>
                <option value="family">Family</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
              <input
                type="text"
                value={formData.start}
                onChange={(e) => setFormData(prev => ({ ...prev, start: e.target.value }))}
                placeholder="6:30 AM"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
              <input
                type="text"
                value={formData.end}
                onChange={(e) => setFormData(prev => ({ ...prev, end: e.target.value }))}
                placeholder="7:30 AM"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Details</label>
              <input
                type="text"
                value={formData.details}
                onChange={(e) => setFormData(prev => ({ ...prev, details: e.target.value }))}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false);
                setEditingId(null);
                setFormData({ day: 1, start: '', end: '', tag: 'study', title: '', details: '' });
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              {editingId ? 'Update' : 'Add'} Block
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
        {dayNames.map((dayName, dayIndex) => {
          const dayBlocks = scheduleByDay[dayIndex] || [];
          return (
            <div key={dayIndex} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
              <h3 className="font-bold text-sm text-gray-700 mb-4 text-center border-b border-gray-300 pb-2">
                {dayName}
              </h3>
              <div className="space-y-2 min-h-[200px]">
                {dayBlocks
                  .sort((a, b) => a.start.localeCompare(b.start))
                  .map((block) => (
                    <div key={block.id} className="group relative">
                      <div className="bg-white rounded-lg p-3 border border-gray-200 hover:shadow-md transition-all">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${tagColors[block.tag]}`}>
                                {block.tag}
                              </span>
                              <span className="text-xs text-gray-500">
                                {block.start} - {block.end}
                              </span>
                            </div>
                            <div className="font-medium text-sm text-gray-800 mb-1">{block.title}</div>
                            {block.details && (
                              <div className="text-xs text-gray-600">{block.details}</div>
                            )}
                          </div>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                            <button
                              onClick={() => handleEdit(block)}
                              className="w-6 h-6 rounded-full bg-blue-100 hover:bg-blue-200 flex items-center justify-center text-blue-600 text-xs"
                              title="Edit"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => handleDelete(block.id)}
                              className="w-6 h-6 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center text-red-600 text-xs"
                              title="Delete"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                {dayBlocks.length === 0 && (
                  <div className="text-center text-gray-400 text-xs py-8">
                    No blocks
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}