// Read-only workspace observer. It reports file changes, never task transcripts.
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {appendFile,mkdir,stat,readFile,writeFile} from 'node:fs/promises';
import path from 'node:path';
const exec=promisify(execFile);
const repository=process.env.AZRAEL_REPOSITORY;
const activity=process.env.AZRAEL_ACTIVITY_FILE;
if(!repository||!activity)throw new Error('AZRAEL_REPOSITORY and AZRAEL_ACTIVITY_FILE are required');
let fingerprint='';
async function observe(){
  try{
    const {stdout}=await exec('git',['-C',repository,'status','--porcelain','--untracked-files=normal','--','azrael'],{timeout:5000,maxBuffer:100000});
    const lines=stdout.trimEnd().split('\n').filter(Boolean);
    const signatures=[];let recent=0;
    for(const line of lines.slice(0,100)){
      const relative=line.slice(3).split(' -> ').at(-1);
      if(!relative||relative.includes('..')||path.isAbsolute(relative))continue;
      try{const info=await stat(path.join(repository,relative));signatures.push(`${line}:${info.mtimeMs}:${info.size}`);if(Date.now()-info.mtimeMs<90000)recent++;}catch{signatures.push(line);}
    }
    const next=signatures.join('\n');
    if(next!==fingerprint&&recent){
      await mkdir(path.dirname(activity),{recursive:true});
      const event={agent:'builder',status:'building',source:'workspace',timestamp:new Date().toISOString(),task:`${recent} recently changed AZRAEL ${recent===1?'file':'files'}`,detail:'Observed file changes in the server checkout. This is workspace activity, not a claim about a specific Codex task.'};
      await appendFile(activity,JSON.stringify(event)+'\n',{mode:0o644});
      const info=await stat(activity);if(info.size>1048576){const text=await readFile(activity,'utf8');await writeFile(activity,text.split('\n').slice(-500).join('\n'),{mode:0o644});}
    }
    fingerprint=next;
  }catch(error){console.error(`Workspace observation unavailable: ${error.code||'error'}`);}
}
await observe();setInterval(observe,20000);
