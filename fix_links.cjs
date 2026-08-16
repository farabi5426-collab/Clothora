const fs = require('fs');

const renderFunc = `
  const renderMessageWithLinks = (text) => {
    if (!text) return null;
    const urlRegex = /(https?:\\/\\/[^\\s]+)/g;
    const parts = text.split(urlRegex);
    return parts.map((part, i) => {
      if (part.match(urlRegex)) {
        return (
          <a 
            key={i} 
            href={part} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="underline hover:opacity-80 break-all"
            onClick={(e) => e.stopPropagation()}
          >
            {part}
          </a>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };
`;

function processFile(filePath, renderTarget) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (!content.includes('renderMessageWithLinks')) {
    // Insert the function just before the return statement of the component
    // We can also insert it inside the component or outside (but it needs React, which is already in scope).
    // Actually, better to insert it outside the component if it doesn't depend on state, but it uses JSX so needs React.
    // Let's just insert it after the imports.
    
    const insertPos = content.indexOf('export default function');
    if (insertPos !== -1) {
      content = content.slice(0, insertPos) + renderFunc.replace('const renderMessageWithLinks = (text)', 'const renderMessageWithLinks = (text: string)') + '\n' + content.slice(insertPos);
    }
  }

  // Replace {msg.text} with {renderMessageWithLinks(msg.text)}
  content = content.replace(/\{msg\.text\}/g, '{renderMessageWithLinks(msg.text)}');
  
  fs.writeFileSync(filePath, content);
  console.log('Fixed', filePath);
}

processFile('./src/components/store/ChatWidget.tsx');
processFile('./src/pages/admin/MessagesManagement.tsx');
