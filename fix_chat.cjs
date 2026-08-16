const fs = require('fs');
const file = './src/components/store/ChatWidget.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/text-on-background/g, 'text-on-primary');

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed', file);
