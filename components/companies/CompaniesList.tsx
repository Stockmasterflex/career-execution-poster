'use client';
import { useState, useEffect } from 'react';
import { companiesRepository } from '../../src/data/companies';
import { useAuth } from '../../contexts/AuthContext';

type Company = { 
  id: string; 
  name: string; 
  tier: string; 
  status: 'lead' | 'applied' | 'interview' | 'offer' | 'rejected'; 
  notes?: string; 
  created_at?: string;
  updated_at?: string;
};

const statusColors = {
  lead: 'bg-gray-100 text-gray-800',
  applied: 'bg-blue-100 text-blue-800',
  interview: 'bg-yellow-100 text-yellow-800',
  offer: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

const tierColors = {
  'Tier 1A': 'bg-red-100 text-red-800',
  'Tier 1B': 'bg-orange-100 text-orange-800',
  'Tier 2': 'bg-yellow-100 text-yellow-800',
  'Tier 3': 'bg-green-100 text-green-800',
};

interface CompaniesListProps {
  userId: string;
}

export default function CompaniesList({ userId }: CompaniesListProps) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    tier: 'Tier 1A',
    status: 'lead' as const,
    notes: '',
  });

  useEffect(() => {
    if (!userId) return;
    loadCompanies();
  }, [userId]);

  const loadCompanies = async () => {
    try {
      const data = await companiesRepository.list(userId);
      setCompanies(data);
    } catch (error) {
      console.error('Failed to load companies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await companiesRepository.update(userId, editingId, formData);
        setCompanies(prev => prev.map(c => c.id === editingId ? { ...c, ...formData } : c));
        setEditingId(null);
      } else {
        const newCompany = await companiesRepository.create(userId, formData);
        setCompanies(prev => [newCompany, ...prev]);
      }
      setFormData({ name: '', tier: 'Tier 1', status: 'lead', notes: '' });
      setShowAddForm(false);
    } catch (error) {
      console.error('Failed to save company:', error);
    }
  };

  const handleEdit = (company: Company) => {
    setFormData({
      name: company.name,
      tier: company.tier,
      status: company.status,
      notes: company.notes || '',
    });
    setEditingId(company.id);
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this company?')) return;
    try {
      await companiesRepository.remove(userId, id);
      setCompanies(prev => prev.filter(c => c.id !== id));
    } catch (error) {
      console.error('Failed to delete company:', error);
    }
  };

  const handleStatusChange = async (id: string, status: Company['status']) => {
    try {
      await companiesRepository.update(userId, id, { status });
      setCompanies(prev => prev.map(c => c.id === id ? { ...c, status } : c));
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  if (!userId) return null;

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Companies</h2>
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

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-3">
          <h2 className="text-xl font-bold">Companies</h2>
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {companies.length} total
          </span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="px-3 py-2 text-gray-600 hover:text-gray-800 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            {isCollapsed ? 'Show All' : 'Hide All'}
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Add Company
          </button>
        </div>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded-lg bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tier</label>
              <select
                value={formData.tier}
                onChange={(e) => setFormData(prev => ({ ...prev, tier: e.target.value }))}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="Tier 1A">Tier 1A</option>
                <option value="Tier 1B">Tier 1B</option>
                <option value="Tier 2">Tier 2</option>
                <option value="Tier 3">Tier 3</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Company['status'] }))}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="lead">Lead</option>
                <option value="applied">Applied</option>
                <option value="interview">Interview</option>
                <option value="offer">Offer</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <input
                type="text"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
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
                setFormData({ name: '', tier: 'Tier 1A', status: 'lead', notes: '' });
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              {editingId ? 'Update' : 'Add'} Company
            </button>
          </div>
        </form>
      )}

      {!isCollapsed && (
        <div className="space-y-3">
          {companies.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No companies yet. Add your first company to get started!</p>
            </div>
          ) : (
            companies.map((company) => (
              <div key={company.id} className="group flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 hover:shadow-sm transition-all">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{company.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${tierColors[company.tier as keyof typeof tierColors] || 'bg-gray-100 text-gray-800'}`}>
                      {company.tier}
                    </span>
                    <select
                      value={company.status}
                      onChange={(e) => handleStatusChange(company.id, e.target.value as Company['status'])}
                      className={`px-2 py-1 rounded-full text-xs font-medium border-0 ${statusColors[company.status]} cursor-pointer`}
                    >
                      <option value="lead">Lead</option>
                      <option value="applied">Applied</option>
                      <option value="interview">Interview</option>
                      <option value="offer">Offer</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                  {company.notes && (
                    <p className="text-sm text-gray-600">{company.notes}</p>
                  )}
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                  <button
                    onClick={() => handleEdit(company)}
                    className="text-blue-600 hover:text-blue-800 text-sm px-2 py-1 rounded hover:bg-blue-50"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(company.id)}
                    className="text-red-600 hover:text-red-800 text-sm px-2 py-1 rounded hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
      
      {isCollapsed && companies.length > 0 && (
        <div className="text-center py-4 text-gray-500">
          <p>{companies.length} companies hidden. Click "Show All" to view them.</p>
        </div>
      )}
    </div>
  );
}