const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, 'public');
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8','.svg':'image/svg+xml','.txt':'text/plain; charset=utf-8','.xml':'application/xml'};
const server = http.createServer((req,res) => {
  if (!['GET','HEAD'].includes(req.method)) {res.writeHead(405,{'Allow':'GET, HEAD'});return res.end();}
  let url;
  try {url = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);} catch {res.writeHead(400);return res.end('Bad request');}
  if(url === '/health') {res.writeHead(200,{'Content-Type':'application/json'});return res.end(req.method==='HEAD'?'':'{"status":"ok"}');}
  const file = path.resolve(root, '.' + (url === '/' ? '/index.html' : url));
  if (!file.startsWith(root + path.sep)) {res.writeHead(403);return res.end('Forbidden');}
  fs.stat(file,(error,stat) => {
    if(error || !stat.isFile()) {res.writeHead(404,{'Content-Type':'text/plain'});return res.end('Page not found');}
    res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin','Content-Security-Policy':"default-src 'self'; style-src 'self'; script-src 'self'; img-src 'self' data:; base-uri 'self'; frame-ancestors 'none'; form-action 'self'",'Cache-Control':'public, max-age=300'});
    if(req.method==='HEAD') return res.end();
    fs.createReadStream(file).pipe(res);
  });
});
server.listen(Number(process.env.PORT)||3000,'0.0.0.0',()=>console.log('FCRI server ready'));
