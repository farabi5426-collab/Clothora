const fs = require('fs');
let code = fs.readFileSync('src/lib/printInvoice.ts', 'utf8');

code = code.replace(
  'src="${item.selectedColor || item.imageUrl}"',
  'src="${item.imageUrl}"'
);

// also fix color display
code = code.replace(
  '${item.selectedColor ? `Color: Yes` : \'\'}',
  '${item.selectedColor ? `Color: ${item.selectedColor}` : \'\'}'
);

fs.writeFileSync('src/lib/printInvoice.ts', code);
console.log("Fixed image URL issue");
