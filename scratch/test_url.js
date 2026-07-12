const http = require('http');

const urls = [
  '/images/sell%201.jpeg',
  '/images/sell-1.jpeg',
  '/images/sell%201.jpeg',
  '/images/sell 1.jpeg',
  '/images/shop1.avif',
  '/images/shop-1.avif'
];

function testUrl(path) {
  return new Promise((resolve) => {
    // encode path if it contains spaces
    const encodedPath = path.includes(' ') ? encodeURI(path) : path;
    const req = http.request({
      hostname: 'localhost',
      port: 3001,
      path: encodedPath,
      method: 'GET'
    }, (res) => {
      resolve({ path, encodedPath, statusCode: res.statusCode, contentType: res.headers['content-type'] });
    });
    
    req.on('error', (err) => {
      resolve({ path, error: err.message });
    });
    
    req.end();
  });
}

async function runTests() {
  console.log("Testing image paths on Next.js server (port 3001)...");
  for (const url of urls) {
    const res = await testUrl(url);
    console.log(res);
  }
}

runTests();
