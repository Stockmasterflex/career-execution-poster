'use client';

import { useState, useEffect } from 'react';

// Mock data
const mockKPIs = [
  { id: 'kpi1', key: 'cmt_progress', title: 'CMT Study Progress', current: 12, target: 35, weeklyTarget: '8-10%/wk', phase: 1, unit: '%' },
  { id: 'kpi2', key: 'network_dms', title: 'Networking DMs', current: 3, target: 40, weeklyTarget: '8-10/wk', phase: 1, unit: '' },
  { id: 'kpi3', key: 'coffee_chats', current: 1, target: 8, weeklyTarget: '2-3/wk', phase: 1, unit: '' },
  { id: 'kpi4', key: 'apps', title: 'Applications Sent', current: 3, target: 50, weeklyTarget: '10-15/wk', phase: 1, unit: '' },
  { id: 'kpi5', key: 'posts', title: 'LinkedIn/Twitter Posts', current: 3, target: 40, weeklyTarget: '4-5/wk', phase: 1, unit: '' },
  { id: 'kpi6', title: 'Website Build', current: 25, target: 100, weeklyTarget: '15-20%/wk', phase: 1, unit: '%' },
];

const mockNonNegotiables = [
  { id: 'nonneg1', period: 'morning', item_id: 'market', text: '📈 Market analysis + trade journal (25 min)', sort: 1, completed: false },
  { id: 'nonneg2', period: 'morning', item_id: 'study', text: '📚 CMT study or skill dev (25 min)', sort: 2, completed: false },
  { id: 'nonneg3', period: 'morning', item_id: 'linkedin', text: '💬 LinkedIn engagement + content planning (10 min)', sort: 3, completed: false },
  { id: 'nonneg4', period: 'evening', item_id: 'review', text: '📊 Close review + tomorrow\'s setup (20 min)', sort: 1, completed: false },
  { id: 'nonneg5', period: 'evening', item_id: 'outreach', text: '🤝 Outreach or content creation (25 min)', sort: 2, completed: false },
  { id: 'nonneg6', period: 'evening', item_id: 'goals', text: '🎯 Goals review + next-day plan (15 min)', sort: 3, completed: false },
];

const mockCompanies = [
  { id: 'comp1', name: 'Charles Schwab (SF HQ)', tier: 'Tier 1A', status: 'lead', notes: 'Trading ops, research, tech' },
  { id: 'comp2', name: 'Interactive Brokers', tier: 'Tier 1A', status: 'lead', notes: 'TA, platform ops, client svcs' },
  { id: 'comp3', name: 'Goldman Sachs', tier: 'Tier 1B', status: 'lead', notes: 'Investment banking, trading' },
  { id: 'comp4', name: 'Morgan Stanley', tier: 'Tier 1B', status: 'lead', notes: 'Wealth management, trading' },
  { id: 'comp5', name: 'JPMorgan Chase', tier: 'Tier 2', status: 'lead', notes: 'Investment banking, trading' },
];

const mockSchedule = [
  // Monday
  { id: 'sched1', day: 1, start: '6:00 AM', end: '7:00 AM', tag: 'gym', title: '💪 Chest + Triceps', details: 'Strength training' },
  { id: 'sched2', day: 1, start: '6:30 AM', end: '1:00 PM', tag: 'market', title: '📈 Market Analysis', details: 'Trade/Analyze' },
  { id: 'sched3', day: 1, start: '1:00 PM', end: '2:00 PM', tag: 'meal', title: '🍽️ Lunch', details: 'Break' },
  { id: 'sched4', day: 1, start: '2:00 PM', end: '4:00 PM', tag: 'study', title: '📚 CMT Study', details: 'Level 1 prep' },
  { id: 'sched5', day: 1, start: '4:00 PM', end: '6:00 PM', tag: 'network', title: '🤝 Networking', details: 'LinkedIn outreach' },
  { id: 'sched6', day: 1, start: '6:00 PM', end: '7:00 PM', tag: 'meal', title: '🍽️ Dinner', details: 'Family time' },
  { id: 'sched7', day: 1, start: '7:00 PM', end: '8:00 PM', tag: 'content', title: '✍️ Content Creation', details: 'LinkedIn posts' },
  { id: 'sched8', day: 1, start: '8:00 PM', end: '9:00 PM', tag: 'family', title: '👨‍👩‍👧‍👦 Family Time', details: 'Quality time' },
  
  // Tuesday
  { id: 'sched9', day: 2, start: '6:00 AM', end: '7:00 AM', tag: 'gym', title: '💪 Back + Biceps', details: 'Strength training' },
  { id: 'sched10', day: 2, start: '6:30 AM', end: '1:00 PM', tag: 'market', title: '📈 Market Analysis', details: 'Trade/Analyze' },
  { id: 'sched11', day: 2, start: '2:00 PM', end: '4:00 PM', tag: 'study', title: '📚 CMT Study', details: 'Level 1 prep' },
  { id: 'sched12', day: 2, start: '4:00 PM', end: '6:00 PM', tag: 'network', title: '🤝 Networking', details: 'LinkedIn outreach' },
  
  // Wednesday
  { id: 'sched13', day: 3, start: '6:00 AM', end: '7:00 AM', tag: 'gym', title: '💪 Legs + Core', details: 'Strength training' },
  { id: 'sched14', day: 3, start: '6:30 AM', end: '1:00 PM', tag: 'market', title: '📈 Market Analysis', details: 'Trade/Analyze' },
  { id: 'sched15', day: 3, start: '2:00 PM', end: '4:00 PM', tag: 'study', title: '📚 CMT Study', details: 'Level 1 prep' },
  { id: 'sched16', day: 3, start: '4:00 PM', end: '6:00 PM', tag: 'network', title: '🤝 Networking', details: 'LinkedIn outreach' },
  
  // Thursday
  { id: 'sched17', day: 4, start: '6:00 AM', end: '7:00 AM', tag: 'gym', title: '💪 Shoulders + Arms', details: 'Strength training' },
  { id: 'sched18', day: 4, start: '6:30 AM', end: '1:00 PM', tag: 'market', title: '📈 Market Analysis', details: 'Trade/Analyze' },
  { id: 'sched19', day: 4, start: '2:00 PM', end: '4:00 PM', tag: 'study', title: '📚 CMT Study', details: 'Level 1 prep' },
  { id: 'sched20', day: 4, start: '4:00 PM', end: '6:00 PM', tag: 'network', title: '🤝 Networking', details: 'LinkedIn outreach' },
  
  // Friday
  { id: 'sched21', day: 5, start: '6:00 AM', end: '7:00 AM', tag: 'gym', title: '💪 Full Body', details: 'Strength training' },
  { id: 'sched22', day: 5, start: '6:30 AM', end: '1:00 PM', tag: 'market', title: '📈 Market Analysis', details: 'Trade/Analyze' },
  { id: 'sched23', day: 5, start: '2:00 PM', end: '4:00 PM', tag: 'study', title: '📚 CMT Study', details: 'Level 1 prep' },
  { id: 'sched24', day: 5, start: '4:00 PM', end: '6:00 PM', tag: 'network', title: '🤝 Networking', details: 'LinkedIn outreach' },
  
  // Saturday
  { id: 'sched25', day: 6, start: '8:00 AM', end: '9:00 AM', tag: 'gym', title: '💪 Cardio + Stretch', details: 'Recovery day' },
  { id: 'sched26', day: 6, start: '9:00 AM', end: '12:00 PM', tag: 'study', title: '📚 CMT Study', details: 'Weekend intensive' },
  { id: 'sched27', day: 6, start: '2:00 PM', end: '4:00 PM', tag: 'content', title: '✍️ Content Creation', details: 'Weekend content' },
  { id: 'sched28', day: 6, start: '4:00 PM', end: '6:00 PM', tag: 'family', title: '👨‍👩‍👧‍👦 Family Time', details: 'Weekend activities' },
  
  // Sunday
  { id: 'sched29', day: 7, start: '8:00 AM', end: '9:00 AM', tag: 'gym', title: '💪 Light Cardio', details: 'Recovery day' },
  { id: 'sched30', day: 7, start: '9:00 AM', end: '12:00 PM', tag: 'study', title: '📚 CMT Study', details: 'Weekend intensive' },
  { id: 'sched31', day: 7, start: '2:00 PM', end: '4:00 PM', tag: 'content', title: '✍️ Content Creation', details: 'Weekend content' },
  { id: 'sched32', day: 7, start: '4:00 PM', end: '6:00 PM', tag: 'family', title: '👨‍👩‍👧‍👦 Family Time', details: 'Weekend activities' },
];

export default function WorkingDashboard() {
  const [kpis, setKpis] = useState(mockKPIs);
  const [nonNegotiables, setNonNegotiables] = useState(mockNonNegotiables);
  const [companies, setCompanies] = useState(mockCompanies);
  const [schedule, setSchedule] = useState(mockSchedule);
  const [todayFocus, setTodayFocus] = useState('What are your top priorities for today? Focus on the most important tasks that will move you closer to your career goals...');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [savingStatus, setSavingStatus] = useState<'saved' | 'saving' | 'error'>('saved');

  const updateKPI = (id: string, newValue: number) => {
    setKpis(prev => prev.map(kpi => 
      kpi.id === id ? { ...kpi, current: newValue } : kpi
    ));
  };

  const toggleNonNegotiable = (id: string) => {
    setNonNegotiables(prev => prev.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const morningTasks = nonNegotiables.filter(item => item.period === 'morning');
  const eveningTasks = nonNegotiables.filter(item => item.period === 'evening');

  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Career OS</h1>
              <p className="text-sm text-gray-600">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })} • Phase 1
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-8">
            {/* Today's Focus */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200 relative">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Today's Focus</h2>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    savingStatus === 'saved' ? 'bg-green-500' : 
                    savingStatus === 'saving' ? 'bg-yellow-500 animate-pulse' : 
                    'bg-red-500'
                  }`}></div>
                  <span className="text-xs text-gray-500">
                    {savingStatus === 'saved' ? 'Saved' : 
                     savingStatus === 'saving' ? 'Saving...' : 
                     'Error saving'}
                  </span>
                </div>
              </div>
              <textarea 
                value={todayFocus}
                onChange={(e) => {
                  setTodayFocus(e.target.value);
                  setSavingStatus('saving');
                  // Simulate saving
                  setTimeout(() => setSavingStatus('saved'), 1000);
                }}
                placeholder="What are your top priorities for today? Focus on the most important tasks that will move you closer to your career goals..."
                className="w-full h-32 p-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none resize-none transition-all duration-200 bg-white/80 backdrop-blur-sm"
              />
              <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                {todayFocus.length} characters
              </div>
            </div>

            {/* Daily Non-Negotiables */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Daily Non-Negotiables</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                  <h3 className="text-lg font-semibold mb-4 text-blue-700 flex items-center">
                    🌅 Morning 
                    <span className="ml-2 bg-blue-200 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {morningTasks.filter(t => t.completed).length}/{morningTasks.length}
                    </span>
                  </h3>
                  <div className="space-y-3">
                    {morningTasks.map((task) => (
                      <div key={task.id} className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => toggleNonNegotiable(task.id)}
                          className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                        />
                        <span className={`text-sm ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                          {task.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
                  <h3 className="text-lg font-semibold mb-4 text-purple-700 flex items-center">
                    🌙 Evening 
                    <span className="ml-2 bg-purple-200 text-purple-800 text-xs px-2 py-1 rounded-full">
                      {eveningTasks.filter(t => t.completed).length}/{eveningTasks.length}
                    </span>
                  </h3>
                  <div className="space-y-3">
                    {eveningTasks.map((task) => (
                      <div key={task.id} className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => toggleNonNegotiable(task.id)}
                          className="w-5 h-5 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                        />
                        <span className={`text-sm ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                          {task.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Weekly Schedule */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Weekly Schedule</h2>
                <div className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full font-medium">
                  {schedule.length} Total Blocks
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
                {dayNames.map((dayName, dayIndex) => {
                  const dayBlocks = schedule.filter(block => block.day === dayIndex + 1);
                  const isWeekend = dayIndex >= 5;
                  return (
                    <div key={dayIndex} className={`rounded-lg p-3 ${
                      isWeekend ? 'bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200' : 'bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200'
                    }`}>
                      <h3 className={`font-semibold mb-3 text-center ${
                        isWeekend ? 'text-purple-800' : 'text-gray-800'
                      }`}>
                        {dayName}
                        {isWeekend && <span className="ml-1">🌙</span>}
                      </h3>
                      <div className="space-y-2">
                        {dayBlocks.length > 0 ? (
                          dayBlocks.map((block) => (
                            <div key={block.id} className="text-xs bg-white/80 backdrop-blur-sm p-2 rounded border border-gray-200 hover:shadow-sm transition-all duration-200">
                              <div className="font-medium text-gray-800">{block.title}</div>
                              <div className="text-gray-500 text-xs">{block.start} - {block.end}</div>
                              <div className={`inline-block px-2 py-1 rounded text-xs mt-1 font-medium ${
                                block.tag === 'gym' ? 'bg-red-100 text-red-800' :
                                block.tag === 'market' ? 'bg-green-100 text-green-800' :
                                block.tag === 'study' ? 'bg-blue-100 text-blue-800' :
                                block.tag === 'network' ? 'bg-purple-100 text-purple-800' :
                                block.tag === 'content' ? 'bg-yellow-100 text-yellow-800' :
                                block.tag === 'meal' ? 'bg-orange-100 text-orange-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {block.tag}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center text-gray-400 py-4">
                            <div className="text-2xl mb-1">📅</div>
                            <div className="text-xs">No schedule</div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* Phase 1 KPIs */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Phase 1 KPIs</h2>
                <div className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-medium">
                  {kpis.filter(kpi => kpi.current >= kpi.target).length} / {kpis.length} Complete
                </div>
              </div>
              <div className="space-y-4">
                {kpis.map((kpi) => {
                  const progress = Math.min((kpi.current / kpi.target) * 100, 100);
                  const isComplete = kpi.current >= kpi.target;
                  return (
                    <div key={kpi.id} className={`rounded-lg p-4 border transition-all duration-200 hover:shadow-md ${
                      isComplete 
                        ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' 
                        : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className={`font-semibold ${isComplete ? 'text-green-800' : 'text-gray-800'}`}>
                          {kpi.title}
                          {isComplete && <span className="ml-2 text-green-600">✓</span>}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => updateKPI(kpi.id, Math.max(0, kpi.current - 1))}
                            className="w-7 h-7 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm hover:bg-blue-600 transition-colors shadow-sm"
                          >
                            −
                          </button>
                          <span className={`text-lg font-bold min-w-[3rem] text-center ${
                            isComplete ? 'text-green-700' : 'text-blue-700'
                          }`}>
                            {kpi.current}
                          </span>
                          <button 
                            onClick={() => updateKPI(kpi.id, kpi.current + 1)}
                            className="w-7 h-7 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm hover:bg-blue-600 transition-colors shadow-sm"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                        <span>{kpi.current} / {kpi.target}{kpi.unit}</span>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">{kpi.weeklyTarget}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full transition-all duration-500 ${
                            isComplete 
                              ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                              : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                          }`}
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {progress.toFixed(1)}% complete
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Companies */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Target Companies</h2>
                <div className="flex items-center space-x-2">
                  <div className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full font-medium">
                    {companies.length} Total
                  </div>
                  <button 
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm shadow-sm"
                  >
                    {isCollapsed ? 'Show All' : 'Hide All'}
                  </button>
                </div>
              </div>
              {!isCollapsed && (
                <div className="space-y-3">
                  {companies.map((company) => (
                    <div key={company.id} className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-all duration-200">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800 mb-1">{company.name}</h3>
                          <div className="flex items-center space-x-2 mb-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              company.tier === 'Tier 1A' ? 'bg-red-100 text-red-800' :
                              company.tier === 'Tier 1B' ? 'bg-orange-100 text-orange-800' :
                              company.tier === 'Tier 2' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {company.tier}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              company.status === 'lead' ? 'bg-yellow-100 text-yellow-800' :
                              company.status === 'applied' ? 'bg-blue-100 text-blue-800' :
                              company.status === 'interview' ? 'bg-purple-100 text-purple-800' :
                              company.status === 'offer' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {company.status}
                            </span>
                          </div>
                          {company.notes && (
                            <p className="text-sm text-gray-600 bg-white/50 rounded p-2 border border-gray-200">
                              {company.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {isCollapsed && companies.length > 0 && (
                <div className="text-center text-gray-500 py-8">
                  <div className="text-4xl mb-2">📊</div>
                  <div className="font-medium">{companies.length} companies hidden</div>
                  <div className="text-sm">Click "Show All" to view details</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
