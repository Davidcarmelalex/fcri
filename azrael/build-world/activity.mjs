export const roles = ['builder', 'sentinel', 'architect', 'courier'];
export const statuses = ['building', 'testing', 'reviewing', 'blocked', 'idle', 'done'];
export function cleanEvent(value) {
  if (!value || !roles.includes(value.agent) || !statuses.includes(value.status)) return null;
  const timestamp = Date.parse(value.timestamp);
  if (!Number.isFinite(timestamp) || timestamp > Date.now() + 30000) return null;
  const clean = (v, max) => typeof v === 'string' ? v.replace(/[\u0000-\u001f]/g, ' ').slice(0, max) : '';
  return {agent:value.agent,status:value.status,source:value.source==='workspace'?'workspace':'agent',timestamp:new Date(timestamp).toISOString(),task:clean(value.task,160),detail:clean(value.detail,300)};
}
export function parseEvents(text) {
  return text.split('\n').flatMap(line => {
    try { const event = cleanEvent(JSON.parse(line)); return event ? [event] : []; } catch { return []; }
  }).sort((a,b)=>Date.parse(b.timestamp)-Date.parse(a.timestamp)).slice(0,40);
}
