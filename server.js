const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
};

const server = http.createServer((req, res) => {
  // Favicon generator API
  if (req.method === 'POST' && req.url === '/api/save-favicons') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        // Save PNG files to assets/
        for (const [filename, base64Data] of Object.entries(payload.pngs || {})) {
          const buffer = Buffer.from(base64Data.replace(/^data:image\/\w+;base64,/, ''), 'base64');
          fs.writeFileSync(path.join(__dirname, 'assets', filename), buffer);
          if (filename === 'favicon-32x32.png') {
            fs.writeFileSync(path.join(__dirname, filename), buffer);
          }
        }

        // Create standard binary .ico if 16x16 and 32x32 PNGs provided
        if (payload.pngs && payload.pngs['favicon-16x16.png'] && payload.pngs['favicon-32x32.png']) {
          const buf16 = Buffer.from(payload.pngs['favicon-16x16.png'].replace(/^data:image\/\w+;base64,/, ''), 'base64');
          const buf32 = Buffer.from(payload.pngs['favicon-32x32.png'].replace(/^data:image\/\w+;base64,/, ''), 'base64');

          const header = Buffer.from([0, 0, 1, 0, 2, 0]); // 2 images
          const offset1 = 6 + 16 * 2; // 38
          const offset2 = offset1 + buf16.length;

          const dir1 = Buffer.alloc(16);
          dir1.writeUInt8(16, 0);
          dir1.writeUInt8(16, 1);
          dir1.writeUInt8(0, 2);
          dir1.writeUInt8(0, 3);
          dir1.writeUInt16LE(1, 4);
          dir1.writeUInt16LE(32, 6);
          dir1.writeUInt32LE(buf16.length, 8);
          dir1.writeUInt32LE(offset1, 12);

          const dir2 = Buffer.alloc(16);
          dir2.writeUInt8(32, 0);
          dir2.writeUInt8(32, 1);
          dir2.writeUInt8(0, 2);
          dir2.writeUInt8(0, 3);
          dir2.writeUInt16LE(1, 4);
          dir2.writeUInt16LE(32, 6);
          dir2.writeUInt32LE(buf32.length, 8);
          dir2.writeUInt32LE(offset2, 12);

          const icoBuffer = Buffer.concat([header, dir1, dir2, buf16, buf32]);
          fs.writeFileSync(path.join(__dirname, 'favicon.ico'), icoBuffer);
          fs.writeFileSync(path.join(__dirname, 'assets', 'favicon.ico'), icoBuffer);
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'Favicons generated and saved successfully' }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath === '/') reqPath = '/index.html';

  const filePath = path.join(__dirname, reqPath);
  const ext = path.extname(filePath).toLowerCase();

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    const mime = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, {
      'Content-Type': mime,
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '*'
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`Editorial Server running at http://localhost:${PORT}`);
});
