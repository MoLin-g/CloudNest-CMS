// 前端静态服务器 + /api 反向代理到后端 3001
// 解决：前端用相对路径 /api 调后端，静态服务器必须代理过去
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 5173;
const DIST = path.resolve(__dirname, 'dist');
const BACKEND = { host: '127.0.0.1', port: 3001 };

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.map': 'application/json',
  '.webp': 'image/webp',
};

function proxyToBackend(req, res) {
  const opts = {
    hostname: BACKEND.host,
    port: BACKEND.port,
    path: req.url,
    method: req.method,
    headers: { ...req.headers, host: `${BACKEND.host}:${BACKEND.port}` },
  };
  const proxyReq = http.request(opts, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  });
  proxyReq.on('error', (e) => {
    res.writeHead(502, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Backend unavailable', detail: e.message }));
  });
  req.pipe(proxyReq, { end: true });
}

const server = http.createServer((req, res) => {
  // /api 请求代理到后端
  if (req.url.startsWith('/api')) {
    return proxyToBackend(req, res);
  }

  // 静态文件
  let urlPath = req.url.split('?')[0];
  if (urlPath === '/') urlPath = '/index.html';

  const filePath = path.join(DIST, urlPath);
  if (!filePath.startsWith(DIST)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      // SPA fallback → index.html
      fs.readFile(path.join(DIST, 'index.html'), (err2, data2) => {
        if (err2) {
          res.writeHead(404);
          res.end('Not Found');
          return;
        }
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(data2);
      });
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Frontend:  http://localhost:${PORT}`);
  console.log(`Admin:     http://localhost:${PORT}/admin`);
  console.log(`API proxy: /api → http://${BACKEND.host}:${BACKEND.port}`);
});
