const fs = require('fs');

const logPath = 'C:\\Users\\Mano\\.gemini\\antigravity\\brain\\b4f30087-40a3-4bac-9b7c-b0b86944eabb\\.system_generated\\logs\\transcript.jsonl';
const lines = fs.readFileSync(logPath, 'utf8').split('\n');

for (const line of lines) {
  if (!line) continue;
  try {
    const logObj = JSON.parse(line);
    if (logObj.step_index === 61 || logObj.content && logObj.content.includes('Total Lines: 625')) {
      console.log("Step Index:", logObj.step_index);
      console.log("Type:", logObj.type);
      console.log("Keys:", Object.keys(logObj));
      console.log("Content length:", logObj.content ? logObj.content.length : 0);
      fs.writeFileSync('scratch/step61.txt', logObj.content || '');
      break;
    }
  } catch (err) {}
}
