const fs = require('fs');

function formatFile(file) {
  let code = fs.readFileSync(file, 'utf8');
  let lines = code.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('export default function')) {
      if (lines[i-1] === '  };') {
        lines[i-1] = '';
      }
      if (lines[i-2] === '  };') {
        lines[i-2] = '';
      }
    }
  }
  fs.writeFileSync(file, lines.join('\n'));
}

formatFile('src/pages/admin/MessagesManagement.tsx');
formatFile('src/components/store/ChatWidget.tsx');
