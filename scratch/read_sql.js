const fs = require('fs');
const content = fs.readFileSync('supabase_init.sql', 'utf8');
console.log("Length of file:", content.length);
console.log(content.substring(0, 1000));
console.log("--- MIDDLE ---");
console.log(content.substring(1000, 2000));
console.log("--- END ---");
console.log(content.substring(2000));
