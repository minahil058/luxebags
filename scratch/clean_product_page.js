const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '..', 'app', 'product', '[id]', 'page.tsx');
let content = fs.readFileSync(targetPath, 'utf8');

// Find the first and second index of "use client"
const firstIdx = content.indexOf('"use client";');
const secondIdx = content.indexOf('"use client";', firstIdx + 1);

if (secondIdx !== -1) {
  console.log("Found duplicate 'use client' at index:", secondIdx);
  const cleanedContent = content.substring(secondIdx);
  fs.writeFileSync(targetPath, cleanedContent, 'utf8');
  console.log("Successfully cleaned up app/product/[id]/page.tsx!");
} else {
  console.log("No duplicate 'use client' found.");
}
