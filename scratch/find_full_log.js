const fs = require('fs');

const logPath = 'C:\\Users\\Mano\\.gemini\\antigravity\\brain\\b4f30087-40a3-4bac-9b7c-b0b86944eabb\\.system_generated\\logs\\transcript.jsonl';
const lines = fs.readFileSync(logPath, 'utf8').split('\n');

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (!line) continue;
  try {
    const logObj = JSON.parse(line);
    if (logObj.content && logObj.content.includes('Total Lines: 625')) {
      console.log(`Found matching step! Index: ${logObj.step_index}, Content length: ${logObj.content.length}`);
      
      const fileLines = [];
      const linesArray = logObj.content.split('\n');
      for (const fileLine of linesArray) {
        const match = fileLine.match(/^\d+:\s(.*)$/);
        if (match) {
          fileLines.push(match[1]);
        } else if (fileLine.match(/^\d+:$/)) {
          fileLines.push("");
        }
      }
      
      const restored = fileLines.join('\n');
      console.log("Restored content length:", restored.length);
      fs.writeFileSync('app/product/[id]/page.tsx', restored, 'utf8');
      console.log("Wrote restored content to app/product/[id]/page.tsx!");
    }
  } catch (err) {}
}
