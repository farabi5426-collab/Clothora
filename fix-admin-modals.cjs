const fs = require('fs');
const path = require('path');

const dir = 'src/pages/admin/';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix general modal headers
  content = content.replace(
    /className="flex justify-between items-center mb-6"/g,
    'className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"'
  );
  content = content.replace(
    /className="flex items-center justify-between mb-6"/g,
    'className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"'
  );
  
  // Specific to OrdersManagement details modal
  content = content.replace(
    /className="p-6 border-b-2 border-surface-bright flex items-center justify-between bg-surface"/g,
    'className="p-6 border-b-2 border-surface-bright flex flex-col sm:flex-row sm:items-center justify-between bg-surface gap-4"'
  );

  // Any other flex gap overlaps for buttons
  content = content.replace(
    /className="flex gap-2"/g,
    'className="flex flex-wrap gap-2"'
  );

  content = content.replace(
    /className="flex gap-3"/g,
    'className="flex flex-wrap gap-3"'
  );

  fs.writeFileSync(filePath, content);
}
