const fs = require('fs');
function fix1(file) {
  let code = fs.readFileSync(file, 'utf8');
  // I replaced EVERY `  };` with `  });`. That ruined the `setTimeout` and `handleReaction` closings again.
  // Let me just manually target the lines.
  let lines = code.split('\n');
  lines = lines.map((line) => {
    if (line === '  });') return '  };';
    if (line === '    });') return '    };';
    return line;
  });
  
  // now I will selectively replace the ones that need `});`
  // 1. parts.map closing
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('    return <span key={i}>{part}</span>;')) {
      lines[i+1] = '  });';
      lines[i+2] = '};';
    }
  }
  
  // 2. MessageBubble closing
  for (let i = 0; i < lines.length; i++) {
    if (lines[i] === 'export default function ChatWidget() {' || lines[i] === 'export default function MessagesManagement() {') {
      if (lines[i-1] === '  };' || lines[i-1] === '  });' || lines[i-1] === '};') {
        lines[i-1] = '  });';
      }
    }
  }
  
  fs.writeFileSync(file, lines.join('\n'));
}
fix1('src/pages/admin/MessagesManagement.tsx');
fix1('src/components/store/ChatWidget.tsx');
