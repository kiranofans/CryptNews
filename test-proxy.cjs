const http = require('http');

const req = http.request({
  hostname: '192.168.0.10',
  port: 3000,
  path: '/api/news',
  method: 'GET',
  headers: {
    'Accept': 'application/json, text/plain, */*',
    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Safari) Version/16.6 Mobile/15E148 Safari/604.1',
    'Origin': 'http://192.168.0.10:3000',
    'Referer': 'http://192.168.0.10:3000/'
  }
}, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => { console.log(`BODY: ${data.substring(0, 100)}...`); });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

req.end();
