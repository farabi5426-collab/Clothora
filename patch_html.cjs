const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

content = content.replace(
  '<link rel="icon" type="image/png" href="/logo.png" />',
  '<link rel="icon" type="image/png" href="/logo.png?v=2" />\n    <link rel="apple-touch-icon" href="/logo.png?v=2" />\n    <link rel="manifest" href="/manifest.json" />'
);

fs.writeFileSync('index.html', content);
