/* Credentials stay in memory; no localStorage, cookies or third-party assets. */
let token = '', me;
const $ = id => document.getElementById(id);
const labels = {calendar:'Calendar',tasks:'Tasks',meetings:'Meetings',enrollments:'Enrollment',sales:'Sales',staffing:'Staffing',expenses:'Expenses'};
const malayalam = {calendar:'കലണ്ടർ',tasks:'ചുമതലകൾ',meetings:'യോഗങ്ങൾ',enrollments:'പ്രവേശനം',sales:'വിൽപ്പന',staffing:'ജീവനക്കാർ',expenses:'ചെലവുകൾ'};
const status = text => { $('status').textContent = text; };
async function api(path, body, key) {
  const headers = {Authorization:`Bearer ${token}`};
  if (body) headers['Content-Type'] = 'application/json';
  if (key) headers['Idempotency-Key'] = key;
  const response = await fetch(path, {method:body?'POST':'GET', headers, body:body?JSON.stringify(body):undefined});
  const result = await response.json();
  if (!response.ok) { if(response.status===401)lock(); throw new Error(result.error || 'Request failed'); }
  return result;
}
function node(tag, text, className) { const e = document.createElement(tag); if(text !== undefined) e.textContent = text; if(className) e.className = className; return e; }
function details(data) {
  const dl = node('dl');
  for(const [key,value] of Object.entries(data)) { dl.append(node('dt', key.replaceAll('_',' ')),node('dd', typeof value==='object'?JSON.stringify(value,null,2):String(value))); }
  return dl;
}
async function run(work) { try {status('Working…'); await work(); status('Updated.');} catch(e) {status(e.message);} }
async function briefing() {
  const r = await api('/api/assistant',{message:$('message').value,language:$('language').value});
  $('brief-title').textContent = r.title; $('answer').textContent = r.answer;
  $('metrics').replaceChildren(); $('sections').replaceChildren();
  const names = r.language==='ml'?malayalam:labels;
  for(const [kind,count] of Object.entries(r.counts)) { const card=node('div',undefined,'metric'); card.append(node('span',names[kind]),node('strong',String(count)),node('small','Records in current view')); $('metrics').append(card); }
  for(const [kind,rows] of Object.entries(r.sections)) {const block=node('div'); block.append(node('h3',names[kind])); for(const row of rows) {const card=node('div',undefined,'card'); card.append(details(row.data));block.append(card);} $('sections').append(block);}
}
const forms = {
  'task.create':[['title','Task title'],['owner','Assignee user ID (optional)'],['due','Due date (optional)']],
  'meeting.record':[['title','Meeting title'],['notes','Meeting notes'],['actions','Action items: one task title per line']],
  'calendar.create':[['title','Meeting title'],['start','Start, e.g. 2026-10-23T09:00:00+05:30'],['end','End with timezone'],['attendees','Attendee addresses, one per line']],
  'outbound.send':[['recipient','Recipient'],['message','Message']],
  'expense.pay':[['payee','Payee'],['amount_minor','Amount in paise'],['currency','Currency (INR)']],
  'record.delete':[['record_id','Record ID'],['reason','Reason']],
  'retention.set':[['retention_days','Data retention days (1–3650)'],['audit_days','Audit retention days (1–3650)']]
};
function fields() { $('fields').replaceChildren();for(const [key,label] of forms[$('operation').value]){const l=node('label',label);const input=node(['notes','actions','message','attendees'].includes(key)?'textarea':'input');input.id='field-'+key;input.required=!['owner','due','actions','attendees'].includes(key);if(['amount_minor','retention_days','audit_days'].includes(key)){input.type='number';input.min='1';input.step='1';}if(key==='currency')input.value='INR';l.append(input);$('fields').append(l);} }
async function queue() {
  const rows=await api('/api/actions');$('queue').replaceChildren();
  for(const r of rows){const card=node('div',undefined,'card');card.append(node('h3',`${r.operation} · ${r.state}`),node('p',`Requested by ${r.requester} · ${r.id}`),details(r.payload));
    const actionButton=(title,verb,body)=>{const b=node('button',title,'secondary'); b.onclick=()=>run(async()=>{b.disabled=true;try{await api(`/api/actions/${r.id}/${verb}`,body);await queue();}finally{b.disabled=false;}});card.append(b);};
    if(r.state==='pending'&&r.requester!==me.user){actionButton('Approve exact content','approve',{digest:r.digest});actionButton('Reject','reject',{digest:r.digest});}
    if(r.state==='approved'&&r.requester===me.user)actionButton('Execute approved action','execute',{});
    if(r.result)card.append(details(r.result));$('queue').append(card);
  }
  if(!rows.length)$('queue').append(node('p','No visible requests.'));
}
$('connect').onclick=()=>run(async()=>{const file=$('credential').files[0];if(!file||file.size>256)throw new Error('Choose your administrator-issued credential file.');token=(await file.text()).trim();me=await api('/api/me');resetIdle();$('identity').textContent=`${me.user} · ${me.role} · ${me.tenant}`;$('login').hidden=true;$('desk').hidden=false;$('credential').value='';await briefing();await queue();});
let idleTimer;
function lock(){token='';me=null;pendingSubmission=null;clearTimeout(idleTimer);$('desk').hidden=true;$('login').hidden=false;for(const id of ['metrics','sections','queue','audit'])$(id).replaceChildren();$('answer').textContent='';$('identity').textContent='';$('credential').value='';$('message').value='Give me an executive briefing';fields();status('Desk locked.');}
function resetIdle(){clearTimeout(idleTimer);if(token)idleTimer=setTimeout(lock,15*60*1000);}
document.addEventListener('pointerdown',resetIdle);document.addEventListener('keydown',resetIdle);
$('logout').onclick=lock;
$('refresh').onclick=()=>run(briefing);$('language').onchange=()=>run(briefing);$('ask').onsubmit=e=>{e.preventDefault();run(briefing);};$('operation').onchange=fields;$('queue-refresh').onclick=()=>run(queue);
let pendingSubmission;
$('action-form').onsubmit=e=>{e.preventDefault();run(async()=>{const operation=$('operation').value;const data={};for(const [key] of forms[operation]){let value=$('field-'+key).value.trim();if(['owner','due'].includes(key)&&!value)continue;if(key==='actions')value=value.split('\n').filter(Boolean).map(title=>({title}));if(key==='attendees')value=value.split('\n').filter(Boolean);if(['amount_minor','retention_days','audit_days'].includes(key))value=Number(value);data[key]=value;}const body={operation,data};const serialized=JSON.stringify(body);if(!pendingSubmission||pendingSubmission.serialized!==serialized)pendingSubmission={serialized,key:crypto.randomUUID()};await api('/api/actions',body,pendingSubmission.key);pendingSubmission=null;await queue();await briefing();});};
$('audit-refresh').onclick=()=>run(async()=>{const rows=await api('/api/audit');$('audit').replaceChildren();for(const r of rows)$('audit').append(node('p',`${new Date(r.created*1000).toLocaleString()} · ${r.actor} · ${r.event} · ${r.object_id}`));});
fields();
