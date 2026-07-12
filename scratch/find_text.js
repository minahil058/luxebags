const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '..', 'app', 'product', '[id]', 'page.tsx');
let content = fs.readFileSync(targetPath, 'utf8');

const lines = content.split('\n');
lines.forEach((line, i) => {
  if (line.includes('checkPurchaserStatus')) {
    console.log(`Line ${i + 1}: [${JSON.stringify(line)}]`);
  }
});
