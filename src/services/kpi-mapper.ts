import { kpiRepo } from '@/src/data/kpis';

export const eventToKpiMap: Record<string, { id: string; delta: number }[]> = {
  '📚 CMT Study (1 hr)': [{ id: 'cmt-study', delta: 1 }],
  '📚 Deep CMT Session': [{ id: 'cmt-study', delta: 2 }],
  '📚 Weekend CMT Study': [{ id: 'cmt-study', delta: 3 }],
  '📚 Major CMT Block': [{ id: 'cmt-study', delta: 4 }],
  '🤝 Networking & Apps': [{ id: 'networking-dms', delta: 2 }, { id: 'applications', delta: 1 }],
  '✍️ Content Creation': [{ id: 'linkedin-posts', delta: 1 }],
  '📊 Market Close + Final Journal': [{ id: 'linkedin-posts', delta: 1 }],
  '📊 Weekly Review': [{ id: 'linkedin-posts', delta: 1 }],
  '🤖 Legend Room Dev': [{ id: 'website-build', delta: 5 }],
  'CMT Study': [{ id: 'cmt-study', delta: 1 }],
  'Deep CMT Session': [{ id: 'cmt-study', delta: 2 }],
  'Weekend CMT Study': [{ id: 'cmt-study', delta: 3 }],
  'Major CMT Block': [{ id: 'cmt-study', delta: 4 }],
  'Networking & Apps': [{ id: 'networking-dms', delta: 2 }, { id: 'applications', delta: 1 }],
  'Content Creation': [{ id: 'linkedin-posts', delta: 1 }],
  'Market Close + Final Journal': [{ id: 'linkedin-posts', delta: 1 }],
  'Weekly Review': [{ id: 'linkedin-posts', delta: 1 }],
  'Legend Room Dev': [{ id: 'website-build', delta: 5 }],
};

export async function applyKpiDeltaForEvent(title: string, checked: boolean) {
  const mappings = eventToKpiMap[title];
  if (!mappings) return;
  
  const kpis = kpiRepo.getKPIs();
  for (const { id, delta } of mappings) {
    const k = kpis.find(x => x.id === id);
    if (!k) continue;
    const next = Math.max(0, (checked ? k.current + delta : k.current - delta));
    kpiRepo.updateKPI(id, next);
  }
  window.dispatchEvent(new Event('kpi:changed'));
}
