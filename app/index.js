const http = require('http');
const router = require('./router')

http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  if (req.url === '/favicon.ico' || req.method === 'OPTIONS') {
    return res.end('');
  }
  router(req, res);
}).listen({ port: 996 }, (err) => {
  if (err) throw err;
  console.log('server is running on port 996');
})
