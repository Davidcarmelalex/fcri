import {appendFile,mkdir} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {cleanEvent} from './activity.mjs';
const args=process.argv.slice(2), input={timestamp:new Date().toISOString()};
for(let i=0;i<args.length;i+=2){if(!/^--(agent|status|task|detail)$/.test(args[i]) || !args[i+1]) throw new Error('Use --agent builder|sentinel|architect|courier --status building|testing|reviewing|blocked|idle|done --task "Public task summary" [--detail "Public detail"]');input[args[i].slice(2)]=args[i+1];}
const event=cleanEvent(input); if(!event) throw new Error('Invalid agent or status');
const target=process.env.AZRAEL_ACTIVITY_FILE||path.join(path.dirname(fileURLToPath(import.meta.url)),'data/activity.jsonl');
await mkdir(path.dirname(target),{recursive:true});
await appendFile(target,JSON.stringify(event)+'\n',{mode:0o644});
console.log(`Reported ${event.agent}: ${event.status}`);
