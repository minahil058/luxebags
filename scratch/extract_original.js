const fs = require('fs');
const path = require('path');

const logPath = 'C:\\Users\\Mano\\.gemini\\antigravity\\brain\\b4f30087-40a3-4bac-9b7c-b0b86944eabb\\.system_generated\\logs\\transcript.jsonl';
const targetPath = path.join(__dirname, '..', 'app', 'product', '[id]', 'page.tsx');

const lines = fs.readFileSync(logPath, 'utf8').split('\n');

let foundContent = null;

for (const line of lines) {
  if (!line) continue;
  try {
    const logObj = JSON.parse(line);
    // Find the view_file call for app/product/[id]/page.tsx which fetched the original contents
    if (logObj.type === 'VIEW_FILE' && logObj.content && logObj.content.includes('Total Lines: 625')) {
      // The content contains the text of the file with line numbers prepended.
      // We need to parse out the file content.
      console.log("Found original file read log in step index:", logObj.step_index);
      
      const contentText = logObj.content;
      const fileLines = [];
      const linesArray = contentText.split('\n');
      for (const fileLine of linesArray) {
        // Match lines like "10: export default function ProductDetailPage() {"
        const match = fileLine.match(/^\d+:\s(.*)$/);
        if (match) {
          fileLines.push(match[1]);
        } else if (fileLine.match(/^\d+:$/)) {
          fileLines.push("");
        }
      }
      foundContent = fileLines.join('\n');
      break;
    }
  } catch (err) {
    // Ignore parse errors for malformed JSON lines
  }
}

if (foundContent) {
  fs.writeFileSync(targetPath, foundContent, 'utf8');
  console.log("Successfully restored original app/product/[id]/page.tsx from logs!");
} else {
  console.log("Could not find the original file content in logs.");
}
