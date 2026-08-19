const fs = require('fs');
let code = fs.readFileSync('src/pages/admin/MessagesManagement.tsx', 'utf8');

// I am just going to rewrite renderMessageWithLinks to be correct.
const badRenderMsg = `const renderMessageWithLinks = (text: string) => {
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
    });
      }
      return <span key={i}>{part}</span>;
  });
};`;

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

// And I am going to fix the component MessageBubble closing correctly.
code = code.replace(/        <\/div>\n      <\/div>\n    \);\n  \}\);\n  \/\/\;\nexport default function/m, 
`        </div>
      </div>
    );
});
export default function`);

// And fix the other weird //;
code = code.replace(/  \/\/\;/g, '  };');
code = code.replace(/    \);\n  \}\);\n    \}/g, '    );\n    }');

fs.writeFileSync('src/pages/admin/MessagesManagement.tsx', code);
