const http = require('http');
const fs = require('fs');
const path = require('path');
const httpServer = http.createServer();

const PORT = 8082;
const PUBLIC_PATH = path.join(__dirname, '../', 'public');
const BUCKET_PATH = path.join(__dirname, '../', 'bucket');

httpServer.on('listening', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

const logRequest = (req) => {
  console.log('Incoming request: ', req.url);
};

httpServer.on('request', (req, res) => {
  logRequest(req);
  if (req.url === '/') {
    const htmlFile = path.join(PUBLIC_PATH, 'index.html');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    return res.end(fs.readFileSync(htmlFile));
  } else if (req.url === '/index.css') {
    const cssFile = path.join(PUBLIC_PATH, 'index.css');
    res.writeHead(200, { 'Content-Type': 'text/css' });
    return res.end(fs.readFileSync(cssFile));
  } else if (req.url === '/js/script.js') {
    const jsFile = path.join(PUBLIC_PATH, 'js', 'script.js');
    res.writeHead(200, { 'Content-Type': 'text/javascript' });
    return res.end(fs.readFileSync(jsFile));
  } else if (req.url === '/upload') {
    const fileName = req.headers['file-name'];
    req.on('data', (chunk) => {
      const file = path.join(BUCKET_PATH, fileName);
      fs.appendFileSync(file, chunk);
      console.log('Recieved chunk: ', chunk.length);
    });

    res.writeHead(200).end('Uploaded');
  }
});

httpServer.listen(PORT);
