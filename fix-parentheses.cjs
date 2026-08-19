const fs = require('fs');

function fix(file) {
  let code = fs.readFileSync(file, 'utf8');
  // I need to add `);` to the end of MessageBubble block!
  // Wait! MessageBubble component ended with `return ( <div>...</div> ); };`
  // But because I used regex to extract it, did I miss the `);`?
  // Actually, I can just append `);` right before `export default function`
  code = code.replace('export default function', ');\nexport default function');
  // wait, is it `);` or just `)` ? Let's check my extraction: 
  // It cut off right before `return (` of the main component!
  // But wait, it didn't cut off at `};` of MessageBubble!
  // Let me just add `);` to line 107 of ChatWidget, let's see.
}
