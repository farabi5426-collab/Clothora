const fs = require('fs');
let code = fs.readFileSync('src/layouts/store/StoreLayout.tsx', 'utf8');

code = code.replace(
  "import ChatWidget from '../../components/store/ChatWidget';",
  "import ChatWidget from '../../components/store/ChatWidget';\nimport WhatsAppButton from '../../components/store/WhatsAppButton';"
);

code = code.replace(
  "<ChatWidget />",
  "<ChatWidget />\n      <WhatsAppButton />"
);

fs.writeFileSync('src/layouts/store/StoreLayout.tsx', code);
console.log('Layout patched');
