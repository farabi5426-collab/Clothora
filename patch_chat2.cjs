const fs = require('fs');
let chatCode = fs.readFileSync('src/components/store/ChatWidget.tsx', 'utf8');

chatCode = chatCode.replace(
  /const \[regEmail, setRegEmail\] = useState\(.*?\);/,
  `const [regPhone, setRegPhone] = useState('');`
);

fs.writeFileSync('src/components/store/ChatWidget.tsx', chatCode);
