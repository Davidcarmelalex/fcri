const $=id=>document.getElementById(id);
const people=[{id:'builder',name:'Builder',role:'Turns plans into working code',icon:'▣'},{id:'architect',name:'Architect',role:'Maps the next chapter',icon:'◇'},{id:'sentinel',name:'Sentinel',role:'Checks every little detail',icon:'✓'},{id:'courier',name:'Courier',role:'Carries changes to review',icon:'↗'}];
let live=null, demo=false, selected='builder', paused=matchMedia('(prefers-reduced-motion: reduce)').matches, busy=false;
const element=(tag,className,text)=>{const node=document.createElement(tag);if(className)node.className=className;if(text!==undefined)node.textContent=text;return node;};
function ago(date){const seconds=Math.max(0,Math.floor((Date.now()-Date.parse(date))/1000));if(!Number.isFinite(seconds))return 'Time unavailable';return seconds<60?'just now':seconds<3600?`${Math.floor(seconds/60)}m ago`:seconds<86400?`${Math.floor(seconds/3600)}h ago`:`${Math.floor(seconds/86400)}d ago`;}
function safeLink(url){try{const parsed=new URL(url);return parsed.protocol==='https:'&&parsed.hostname==='github.com'?parsed.href:null;}catch{return null;}}
function example(){const timestamp=new Date().toISOString();return {repository:{pulls:[{number:'DEMO',title:'A new block in the foundation',state:'open',draft:true}],commits:[],checks:[{status:'in_progress',branch:'illustrative-world'}],stale:false},activity:[{agent:'builder',status:'building',task:'Assembling the core engine',detail:'Illustrative activity — this is not a real agent heartbeat.',timestamp},{agent:'architect',status:'reviewing',task:'Mapping the policy gate',detail:'Illustrative activity — the architect is planning a new platform.',timestamp},{agent:'sentinel',status:'testing',task:'Checking the next checkpoint',detail:'Illustrative activity — testing animation only.',timestamp},{agent:'courier',status:'idle',task:'Waiting for the next delivery',detail:'Illustrative activity — no deployment is running.',timestamp}],serverTime:timestamp};}
function current(){return demo?example():live;}
function agentState(person,data){const event=data?.activity?.find(e=>e.agent===person.id);const fresh=!!event&&(Date.parse(data.serverTime)-Date.parse(event.timestamp)<90000)&&(Date.now()-Date.parse(event.timestamp)<90000);return {event,fresh,working:fresh&&['building','testing','reviewing'].includes(event.status)};}
function render(){const data=current();let active=0;
  $('crew').replaceChildren();
  for(const person of people){const state=agentState(person,data);if(state.fresh)active++;
    const character=document.querySelector(`.character.${person.id}`);character.classList.toggle('active',state.working);character.classList.toggle('selected',selected===person.id);
    $(`speech-${person.id}`).textContent=state.fresh?state.event.task||state.event.status:'Waiting for a heartbeat';
    const card=element('button',`crew-card${selected===person.id?' selected':''}`);card.dataset.agent=person.id;card.setAttribute('aria-pressed',String(selected===person.id));
    card.append(element('span','crew-avatar',person.icon));const info=element('div');info.append(element('h3','',person.name),element('div','role',person.role));card.append(info);
    const status=element('div',`agent-status${state.fresh?' fresh':''}`);status.append(element('i'),document.createTextNode(state.fresh?`${state.event.status} · ${ago(state.event.timestamp)}`:state.event?`Last report ${ago(state.event.timestamp)} · idle`:'No heartbeat connected'));card.append(status);$('crew').append(card);
    if(person.id===selected){const detail=$('quest-detail');detail.replaceChildren(element('span','eyebrow',`${person.name.toUpperCase()} · ${state.fresh?'CURRENT QUEST':'AT THE CAMPFIRE'}`),element('h3','',state.event?.task||'Waiting for the next quest'),element('p','',state.event?.detail||(state.fresh?'Agent-reported activity from this server.':'Connect this agent’s heartbeat to show its actual work. GitHub activity alone does not mean an agent is running.')));}
  }
  $('active-count').textContent=String(active);$('heartbeat').textContent=active?`${active} connected`:'Waiting';$('scene-status').textContent=active?`${active} fresh agent ${active===1?'heartbeat':'heartbeats'}`:'No fresh agent heartbeats';
  $('legend').textContent=demo?'DEMO · All agent activity is illustrative':'Animation is illustrative · Work status comes from fresh agent heartbeats';
  const repository=data?.repository;const pulls=repository?.pulls||[];
  $('merged').textContent=repository?String(pulls.filter(p=>p.state==='merged').length):'—';$('open-prs').textContent=repository?String(pulls.filter(p=>p.state==='open').length):'—';
  const run=repository?.checks?.[0];$('ci-status').textContent=!run?'Unknown':run.status!=='completed'?'Running':run.conclusion==='success'?'Passing':run.conclusion==='failure'?'Failed':run.conclusion||'Unknown';$('ci-branch').textContent=run?.branch||'No AZRAEL test run found';
  for(const [key,n]of [['core-check',8],['policy-check',9]]){$(key).textContent=pulls.some(p=>p.number===n&&p.state==='merged')?'✓':'◌';}
  $('test-check').textContent=run?.conclusion==='success'?'✓':'◌';
  const connected=!!repository&&!repository.stale;$('connection').classList.toggle('stale',!connected&&!demo);$('connection').replaceChildren(element('i'),document.createTextNode(demo?'Demo world':!repository?'Connecting to GitHub':connected?'GitHub connected':'GitHub data delayed'));
  $('feed-mode').textContent=demo?'DEMO FEED':'LIVE FEED';$('demo-banner').hidden=!demo;$('demo').textContent=demo?'↩ Return to live':'✦ Explore demo';$('demo').setAttribute('aria-pressed',String(demo));$('footer-mode').textContent=demo?'Illustrative demo mode':'GitHub + server heartbeats';
  $('updated').textContent=data?`Updated ${ago(data.serverTime)}`:'Not synced yet';
  const feed=[];
  for(const event of data?.activity?.slice(0,8)||[])feed.push({title:`${people.find(p=>p.id===event.agent)?.name||'Agent'} · ${event.task||event.status}`,meta:`${event.source==='workspace'?'Workspace observation':'Agent report'} · ${ago(event.timestamp)}`,symbol:'✦',date:event.timestamp});
  for(const p of pulls.slice(0,5))feed.push({title:`#${p.number} · ${p.title}`,meta:`GitHub · ${p.draft?'draft · ':''}${p.state}`,symbol:'⚑',url:p.url,date:p.updatedAt});
  for(const c of repository?.commits?.slice(0,3)||[])feed.push({title:c.message,meta:`Commit ${c.sha.slice(0,7)} · ${ago(c.date)}`,symbol:'▤',url:c.url,date:c.date});
  feed.sort((a,b)=>(Date.parse(b.date)||0)-(Date.parse(a.date)||0));$('feed').replaceChildren();
  for(const item of feed.slice(0,7)){const row=element('div','feed-row');row.append(element('span','feed-symbol',item.symbol));const body=element('div');const title=element('h3');const url=safeLink(item.url);if(url){const a=element('a','',item.title);a.href=url;a.target='_blank';a.rel='noopener';title.append(a);}else title.textContent=item.title;body.append(title,element('p','',item.meta));row.append(body);$('feed').append(row);}
  if(!feed.length)$('feed').append(element('p','feed-empty','The world is quiet for now. Repository updates and agent heartbeats will appear here when connected.'));
  $('notice').textContent=demo?'':repository?.errors?.length?'Some GitHub updates are delayed. Cached information may be shown; agent heartbeats are checked separately.':'';
}
document.addEventListener('click',event=>{const card=event.target.closest('[data-agent]');if(card){selected=card.dataset.agent;render();}});
$('demo').addEventListener('click',()=>{demo=!demo;render();});
function motion(){document.body.classList.toggle('paused',paused);$('motion').setAttribute('aria-pressed',String(paused));$('motion').replaceChildren(document.createTextNode(paused?'▶ ':'Ⅱ '),element('span','',paused?'Play':'Pause'));}
$('motion').addEventListener('click',()=>{paused=!paused;motion();});motion();
$('theme').addEventListener('click',()=>{const night=document.body.classList.toggle('night');$('theme').setAttribute('aria-pressed',String(night));$('theme').replaceChildren(document.createTextNode(night?'☀ ':'☾ '),element('span','',night?'Day':'Night'));});
async function sync(){if(busy||document.hidden)return;busy=true;try{const response=await fetch('./api/world',{cache:'no-store',signal:AbortSignal.timeout(12000)});if(!response.ok)throw new Error();live=await response.json();render();}catch{$('connection').classList.add('stale');$('connection').replaceChildren(element('i'),document.createTextNode('Connection interrupted'));$('notice').textContent='The server is temporarily unreachable. The last received state is shown; work indicators expire after 90 seconds.';}finally{busy=false;}}
render();sync();setInterval(sync,10000);setInterval(()=>{if(!document.hidden)render();},15000);document.addEventListener('visibilitychange',()=>{if(!document.hidden)sync();});
