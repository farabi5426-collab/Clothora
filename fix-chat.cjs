const fs = require('fs');
let code = fs.readFileSync('src/components/store/ChatWidget.tsx', 'utf8');

const exportStr = "export default function ChatWidget() {";
const exportStart = code.indexOf(exportStr);

const firstReturnStr = "  return (\n      <div className={`flex gap-3 ${isMe ? 'justify-end' : 'justify-start'}`}>";
const firstReturnStart = code.indexOf(firstReturnStr);

const secondReturnStr = "  return (\n    <div className=\"fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[100]\">";
const secondReturnStart = code.indexOf(secondReturnStr);

const endOfBubbleIndex = code.lastIndexOf('};\n', secondReturnStart);
const endOfBubble = endOfBubbleIndex + 3;

const header = code.substring(0, exportStart);
const mainState = code.substring(exportStart, firstReturnStart);
const bubbleReturn = code.substring(firstReturnStart, endOfBubble);
const mainReturn = code.substring(secondReturnStart);

const fixedCode = header + bubbleReturn + '\n' + mainState + mainReturn;

fs.writeFileSync('src/components/store/ChatWidget.tsx', fixedCode + '}\n');
