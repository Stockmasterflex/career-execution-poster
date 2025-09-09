'use client';
import { useState, useEffect } from 'react';
import { kpiRepository } from '../../data/kpis';
import { useAuth } from '../../../contexts/AuthContext';

type KPI = { id: string; key: string; title: string; current: number; target: number; weeklyTarget?: string; phase?: number };

export default function KpiStrip() {
  const { user, ready } = useAuth();
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (!ready || !user) return;
    loadKpis();
  }, [ready, user]);

  const loadKpis = async () => {
    try {
      const data = await kpiRepository.getAll(user.id);
      setKpis(data);
    } catch (error) {
      console.error('Failed to load KPIs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateKpi = async (id: string, current: number) => {
    try {
      await kpiRepository.updateCurrent(user.id, id, current);
      setKpis(prev => prev.map(k => k.id === id ? { ...k, current } : k));
    } catch (error) {
      console.error('Failed to update KPI:', error);
    }
  };

  const handleCurrentChange = (id: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setKpis(prev => prev.map(k => k.id === id ? { ...k, current: numValue } : k));
  };

  const handleBlur = (id: string, current: number) => {
    setEditingId(null);
    updateKpi(id, current);
  };

  if (!user) return null;

  if (isLoading) {
    return (
      <div className="kpi-strip">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="kpi-mini animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-2 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (kpis.length === 0) {
    return (
      <div className="kpi-strip">
        <div className="col-span-full text-center py-8">
          <p className="text-gray-500 mb-4">No KPIs yet</p>
          <button 
            onClick={loadKpis}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Load Demo KPIs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {kpis.map((kpi) => (
        <div key={kpi.id} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100 hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-semibold text-gray-800 text-sm">{kpi.title}</h3>
            <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">{kpi.weeklyTarget}</span>
          </div>
          
          <div className="mb-3">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Progress</span>
              <span>{Math.round((kpi.current / kpi.target) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${Math.min((kpi.current / kpi.target) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  const newValue = Math.max(0, kpi.current - 1);
                  handleCurrentChange(kpi.id, newValue.toString());
                  updateKpi(kpi.id, newValue);
                }}
                className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
              >
                −
              </button>
              
              {editingId === kpi.id ? (
                <input
                  type="number"
                  value={kpi.current}
                  onChange={(e) => handleCurrentChange(kpi.id, e.target.value)}
                  onBlur={() => handleBlur(kpi.id, kpi.current)}
                  onKeyPress={(e) => e.key === 'Enter' && handleBlur(kpi.id, kpi.current)}
                  className="w-16 text-center bg-white border border-blue-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              ) : (
                <span 
                  onClick={() => setEditingId(kpi.id)}
                  className="cursor-pointer hover:bg-blue-50 px-2 py-1 rounded text-sm font-medium min-w-[3rem] text-center"
                >
                  {kpi.current}
                </span>
              )}
              
              <button
                onClick={() => {
                  const newValue = kpi.current + 1;
                  handleCurrentChange(kpi.id, newValue.toString());
                  updateKpi(kpi.id, newValue);
                }}
                className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
              >
                +
              </button>
            </div>
            
            <div className="text-xs text-gray-500">
              / {kpi.target}{kpi.unit}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
