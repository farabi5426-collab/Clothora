const fs = require('fs');

let content = fs.readFileSync('src/components/admin/AdminLayout.tsx', 'utf8');

// Fix the flex issues in the sidebar navigation
content = content.replace(
  /className="flex-1 px-4 py-6 space-y-2 flex md:flex-col overflow-x-auto md:overflow-y-auto overflow-y-hidden"/,
  'className="flex-1 px-4 md:py-6 py-4 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-y-auto overflow-y-hidden custom-scrollbar"'
);

content = content.replace(
  /className="w-full md:w-64 bg-background md:bg-surface-container-lowest border-b md:border-b-0 md:border-r border-outline-variant flex flex-col flex-shrink-0"/,
  'className="w-full md:w-64 bg-surface-container-lowest border-b md:border-b-0 md:border-r border-outline-variant flex flex-col flex-shrink-0"'
);

fs.writeFileSync('src/components/admin/AdminLayout.tsx', content);
