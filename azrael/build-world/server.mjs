import http from 'node:http';
import {readFile, stat, open} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {parseEvents} from './activity.mjs';

const root = path.dirname(fileURLToPath(import.meta.url));
const activityFile = process.env.AZRAEL_ACTIVITY_FILE || path.join(root,'data/activity.jsonl');
const repo = 'Davidcarmelalex/fcri';
let cache = null, expires = 0, pending;
const headers = {'Accept':'application/vnd.github+json','User-Agent':'AZRAEL-Build-World',...(process.env.GITHUB_TOKEN ? {'Authorization':`Bearer ${process.env.GITHUB_TOKEN}`} : {})};
async function github(endpoint) {
  const response = await fetch(`https://api.github.com/repos/${repo}/${endpoint}`,{headers,signal:AbortSignal.timeout(8000)});
  if (!response.ok) throw new Error(`GitHub returned ${response.status}`);
  return response.json();
}
async function repositoryState() {
  if (cache && Date.now()<expires) return cache;
  if (pending) return pending;
  pending = (async()=>{
    const [pulls,commits,runs] = await Promise.allSettled([github('pulls?state=all&per_page=40&sort=updated&direction=desc'),github('commits?path=azrael&per_page=6'),github('actions/runs?per_page=30')]);
    const errors = [];
    const value = (result,key,fallback) => {
      if (result.status==='fulfilled') return result.value;
      errors.push(`${key}: ${result.reason.message}`); return cache?.[key] || fallback;
    };
    const rawPulls=value(pulls,'pulls',[]), rawCommits=value(commits,'commits',[]);
    const rawRuns=runs.status==='fulfilled' ? runs.value.workflow_runs : null;
    if(runs.status==='rejected') errors.push(`checks: ${runs.reason.message}`);
    cache={
      pulls:rawPulls.filter(p=>/azrael|az-00/i.test(p.title||'')).map(p=>({number:p.number,title:p.title,url:p.html_url||p.url,state:p.merged_at?'merged':p.state,draft:!!p.draft,updatedAt:p.updated_at||p.updatedAt})),
      commits:rawCommits.map(c=>({sha:c.sha,message:(c.commit?.message||c.message||'').split('\n')[0],url:c.html_url||c.url,date:c.commit?.committer?.date||c.date})),
      checks:rawRuns ? rawRuns.filter(r=>(r.path||'').includes('azrael-core')).slice(0,5).map(r=>({name:r.name,status:r.status,conclusion:r.conclusion,branch:r.head_branch,url:r.html_url})) : cache?.checks||[],
      fetchedAt:new Date().toISOString(),source:'GitHub',stale:errors.length>0,errors,
      lastSuccessfulAt:errors.length ? cache?.lastSuccessfulAt||null : new Date().toISOString(),
    };
    expires=Date.now()+60000; return cache;
  })().finally(()=>{pending=null;});
  return pending;
}
async function events() {
  try {
    const info=await stat(activityFile); const size=Math.min(info.size,65536);
    const file=await open(activityFile,'r');
    try {const buffer=Buffer.alloc(size); await file.read(buffer,0,size,info.size-size); return parseEvents(buffer.toString('utf8'));}
    finally {await file.close();}
  } catch(error) {if(error.code==='ENOENT') return []; throw error;}
}
const security={'X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin','Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'self'; base-uri 'self'"};
const assets={'/':['index.html','text/html; charset=utf-8'],'/app.js':['app.js','text/javascript; charset=utf-8'],'/style.css':['style.css','text/css; charset=utf-8']};
const server=http.createServer(async(req,res)=>{
  try {
    if(req.method!=='GET'){res.writeHead(405,{...security,Allow:'GET'});return res.end();}
    const url=new URL(req.url,'http://localhost');
    if(url.pathname==='/healthz'){res.writeHead(200,{...security,'Content-Type':'application/json'});return res.end('{"ok":true}');}
    if(url.pathname==='/api/world'){
      const [repository,activity]=await Promise.all([repositoryState(),events()]);
      res.writeHead(200,{...security,'Content-Type':'application/json','Cache-Control':'no-store'});
      return res.end(JSON.stringify({repository,activity,serverTime:new Date().toISOString(),heartbeatWindowSeconds:90}));
    }
    const asset=assets[url.pathname];
    if(!asset){res.writeHead(404,security);return res.end('Not found');}
    res.writeHead(200,{...security,'Content-Type':asset[1],'Cache-Control':'no-cache'});
    res.end(await readFile(path.join(root,'public',asset[0])));
  } catch {res.writeHead(503,{...security,'Content-Type':'application/json'});res.end('{"error":"World status temporarily unavailable"}');}
});
server.listen(Number(process.env.PORT||3088),process.env.HOST||'127.0.0.1',()=>console.log(`AZRAEL Build World: http://${process.env.HOST||'127.0.0.1'}:${process.env.PORT||3088}`));
for(const signal of ['SIGTERM','SIGINT']) process.on(signal,()=>server.close(()=>process.exit(0)));
