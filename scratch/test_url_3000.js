const http = require('http');

const urls = [
  '/images/sell%201.jpeg',
  '/images/shop1.avif',
  '/images/style%201.jpeg',
  '/images/feature%201.jpeg'
];

function testUrl(path) {
  return new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: 'GET'
    }, (res) => {
      resolve({ path, statusCode: res.statusCode, contentType: res.headers['content-type'] });
    });
    
    req.on('error', (err) => {
      resolve({ path, error: err.message });
    });
    
    req.end();
  });
}

async function runTests() {
  console.log("Testing image paths on Next.js server (port 3000)...");
  for (const url of urls) {
    const res = await testUrl(url);
    console.log(res);
  }
}

runTests();
