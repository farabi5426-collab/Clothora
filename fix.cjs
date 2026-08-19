const fs = require('fs');

function fix(file) {
  let code = fs.readFileSync(file, 'utf8');
  code = code.replace(/const longPressEvent = useLongPress\(\(\) => setActiveReactionMsg\(msg\.id\), \(\) => \{\}, \{ delay: 400 \}\);\s+export default function/g, 'const longPressEvent = useLongPress(() => setActiveReactionMsg(msg.id), () => {}, { delay: 400 });\nexport default function');
  fs.writeFileSync(file, code);
}
// wait, the problem is my regex extraction was flawed. It cut out the body of MessageBubble!

function restoreAndFix() {
  // Let's run git checkout on these two files to undo my mess, then apply the right patch.
}
