const fs = require('fs');

['public/index.html', 'public/admin.html'].forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(
      '<link rel="icon" type="image/png" href="/logo.png" />',
      '<link rel="icon" type="image/png" href="/logo.png?v=2" />\n    <link rel="apple-touch-icon" href="/logo.png?v=2" />\n    <link rel="manifest" href="/manifest.json" />'
    );
    fs.writeFileSync(file, content);
  }
});
