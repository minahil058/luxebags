const fs = require('fs');
let content = fs.readFileSync('supabase_init.sql', 'utf8').trim();

// If it starts and ends with double quotes, it's a JSON string. Let's decode it safely.
try {
  // Let's decode it by creating a dummy JSON object
  const parsed = JSON.parse('{"data":' + content + '}');
  console.log("SUCCESSFULLY PARSED JSON:");
  console.log(parsed.data);
} catch (e) {
  console.log("JSON parsing failed, trying manual replacement:", e.message);
  // Manual unescaping of newlines and quotes
  let unescaped = content
    .replace(/^"/, '')
    .replace(/"$/, '')
    .replace(/\\n/g, '\n')
    .replace(/\\"/g, '"')
    .replace(/\\'/g, "'");
  console.log("MANUAL UNESCAPE:");
  console.log(unescaped);
}
