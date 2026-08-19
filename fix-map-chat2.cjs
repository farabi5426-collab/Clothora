const fs = require('fs');
let code = fs.readFileSync('src/components/store/ChatWidget.tsx', 'utf8');

code = code.replace(/const renderMessageWithLinks = \(text: string\) => \{[\s\S]*?\};\nconst formatTime/m, 
`const renderMessageWithLinks = (text: string) => {
  if (!text) return null;
  const urlRegex = /(https?:\\/\\/[^\\s]+)/g;
  const parts = text.split(urlRegex);
  return parts.map((part, i) => {
    if (part.match(urlRegex)) {
      return (
        <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="underline hover:opacity-80 break-all" onClick={(e) => e.stopPropagation()}>
          {part}
        </a>
      );
    }
    return <span key={i}>{part}</span>;
  });
};
const formatTime`);

// Fix MessageBubble closing
code = code.replace(/        <\/div>\n      <\/div>\n    \);\n  \}\);\n  \/\/\;\nexport default function/m, 
`        </div>
      </div>
    );
});
export default function`);

// Other random fixes
code = code.replace(/  \/\/\;/g, '  };');
code = code.replace(/    \);\n  \}\);\n    \}/g, '    );\n    }');

fs.writeFileSync('src/components/store/ChatWidget.tsx', code);
