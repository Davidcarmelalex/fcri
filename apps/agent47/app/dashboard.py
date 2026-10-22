from fastapi.responses import HTMLResponse

DASHBOARD = """<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>AGENT 47 // FCRI × AIBI</title><style>
:root{color-scheme:dark;font-family:Inter,system-ui,Arial,sans-serif;background:#070a0e;color:#e9f2f2}
*{box-sizing:border-box}body{margin:0}header{padding:24px 5vw;border-bottom:1px solid #27383a;display:flex;justify-content:space-between;align-items:center}
h1{letter-spacing:.15em;font-size:clamp(28px,4vw,48px);margin:0;color:#f1f6f4}small,.muted{color:#8b9ea1}
.badge{border:1px solid #39665e;color:#9be0c9;padding:8px 14px;border-radius:4px}
main{padding:36px 5vw;max-width:1350px;margin:auto}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px}
.card{background:#11191d;border:1px solid #293b40;padding:24px;border-radius:10px;min-height:130px}
.card h3{color:#8ed9c3;margin-top:0}button{background:#9be0c9;color:#07110f;border:0;border-radius:5px;padding:11px 16px;font-weight:700;cursor:pointer}
input{background:#0b1216;color:white;border:1px solid #466063;border-radius:5px;padding:12px;width:min(460px,100%)}
.toolbar{display:flex;gap:10px;flex-wrap:wrap;margin:20px 0 28px}pre{white-space:pre-wrap;overflow-wrap:anywhere;color:#c7d4d3}
</style></head><body><header><div><small>FUSION CIVILIZATION RESEARCH INSTITUTE × AIBI</small><h1>AGENT // 47</h1></div><span class="badge">FOUNDATION ONLINE</span></header>
<main><p class="muted">Director command center • Local secure prototype • Model-backed chat • Approved calculator tool only</p>
<section class="toolbar"><input id="key" type="password" autocomplete="off" placeholder="Enter server API key"><button id="connect">Connect</button><button id="clear">Clear key</button></section>
<p id="message" aria-live="polite">Authentication required to view agent registry.</p>
<section class="grid"><div class="card"><h3>SYSTEM STATUS</h3><pre id="status">Not connected</pre></div><div class="card"><h3>RESEARCH DIVISION</h3><p>FCRI intelligence and scientific workflows</p></div><div class="card"><h3>OPERATIONS DIVISION</h3><p>AIBI operational coordination</p></div><div class="card"><h3>SECURITY POLICY</h3><p>Execution disabled • No external integrations</p></div></section>
<h2>COMMAND CHAT</h2><section class="card"><p class="muted">Model provider must be configured on the server. Conversations are stored in server-side SQLite. Avoid sensitive data.</p><div id="conversation" role="log" aria-live="polite" style="max-height:360px;overflow:auto"></div><div class="toolbar"><input id="prompt" maxlength="8000" placeholder="Ask Agent 47..." aria-label="Message"><button id="send">Send</button><button id="newsession">New session</button></div></section><h2>AGENT REGISTRY</h2><section id="agents" class="grid"></section>
</main><script>
let key=""; let session=null;
document.getElementById("connect").onclick=async()=>{
key=document.getElementById("key").value;
document.getElementById("key").value="";
try{
const headers={"X-API-Key":key};
const [s,a]=await Promise.all([fetch("/v1/status",{headers,cache:"no-store"}),fetch("/v1/agents",{headers,cache:"no-store"})]);
if(!s.ok||!a.ok)throw new Error("Authentication failed or server unavailable");
const status=await s.json(),agents=await a.json();
document.getElementById("status").textContent=JSON.stringify(status,null,2);
document.getElementById("agents").replaceChildren(...agents.map(x=>{const c=document.createElement("div");c.className="card";const h=document.createElement("h3");h.textContent=x.name;const p=document.createElement("p");p.textContent=x.division+" / "+x.status;c.append(h,p);return c;}));
document.getElementById("message").textContent="Connected. Registry is informational; no actions are enabled.";
}catch(e){key="";document.getElementById("message").textContent=e.message;}
};
document.getElementById("clear").onclick=()=>{key="";session=null;location.reload()};
document.getElementById("newsession").onclick=()=>{session=null;document.getElementById("conversation").replaceChildren()};
document.getElementById("send").onclick=async()=>{
 const promptInput=document.getElementById("prompt");
 const prompt=promptInput.value.trim();
 if(!key){document.getElementById("message").textContent="Connect with your API key first.";return;}
 if(!prompt)return;
 const send=document.getElementById("send");send.disabled=true;promptInput.value="";
 const log=document.getElementById("conversation");
 const add=(label,value)=>{const p=document.createElement("p");const b=document.createElement("strong");b.textContent=label+": ";const t=document.createTextNode(value);p.append(b,t);log.append(p);log.scrollTop=log.scrollHeight;};
 add("YOU",prompt);
 try{
  const res=await fetch("/v1/chat",{method:"POST",headers:{"Content-Type":"application/json","X-API-Key":key},body:JSON.stringify({prompt,session}),cache:"no-store"});
  if(!res.ok)throw new Error("Request failed ("+res.status+"). Check provider configuration.");
  const data=await res.json();session=data.session;add("AGENT 47",data.answer);
 }catch(e){add("SYSTEM",e.message)}finally{send.disabled=false;}
};
document.getElementById("prompt").addEventListener("keydown",e=>{if(e.key==="Enter")document.getElementById("send").click()});
</script></body></html>"""

def render_dashboard() -> HTMLResponse:
    return HTMLResponse(DASHBOARD, headers={"Cache-Control": "no-store", "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; connect-src 'self'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'", "X-Content-Type-Options": "nosniff", "Referrer-Policy": "no-referrer"})
