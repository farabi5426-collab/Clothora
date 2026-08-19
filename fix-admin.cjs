const fs = require('fs');
let code = fs.readFileSync('src/pages/admin/MessagesManagement.tsx', 'utf8');

const exportStr = "export default function MessagesManagement() {";
const exportStart = code.indexOf(exportStr);

const firstReturnStr = "  return (\n      <div className={`flex gap-3 ${isAdmin ? 'justify-end' : 'justify-start'}`}>";
const firstReturnStart = code.indexOf(firstReturnStr);

const secondReturnStr = "  return (\n    <div className=\"space-y-4 h-full flex flex-col\">";
const secondReturnStart = code.indexOf(secondReturnStr);

const endOfBubbleStr = "  );\n};\n"; // We don't know exactly what it looks like, let's just find "};" before secondReturnStr.

const endOfBubbleIndex = code.lastIndexOf('};\n', secondReturnStart);
const endOfBubble = endOfBubbleIndex + 3;

// The structure is currently:
// 1. Header (0 to exportStart)
// 2. Main component state/functions (exportStart to firstReturnStart)
// 3. MessageBubble return (firstReturnStart to endOfBubble)
// 4. Main component return (secondReturnStart to EOF)

const header = code.substring(0, exportStart);
const mainState = code.substring(exportStart, firstReturnStart);
const bubbleReturn = code.substring(firstReturnStart, endOfBubble);
const mainReturn = code.substring(secondReturnStart);

const fixedCode = header + bubbleReturn + '\n' + mainState + mainReturn;

fs.writeFileSync('src/pages/admin/MessagesManagement.tsx', fixedCode + '}\n');
