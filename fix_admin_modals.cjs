const fs = require('fs');
const glob = require('glob'); // Note: glob is not always available, let's just use readdir

const files = fs.readdirSync('src/pages/admin').filter(f => f.endsWith('.tsx')).map(f => 'src/pages/admin/' + f);

for (const file of files) {
  let content = fs.readFileSync(file, 'utf-8');
  
  // Replace standard modal classes to ensure responsiveness
  content = content.replace(
    /className="bg-surface-container-lowest border border-outline-variant w-full (max-w-\w+) p-8( relative)?"/g,
    'className="bg-surface-container-lowest border border-outline-variant w-full $1 p-4 sm:p-8 max-h-[90vh] overflow-y-auto relative"'
  );
  
  // Some might already have max-h-[90vh]
  content = content.replace(
    /className="bg-surface-container-lowest border border-outline-variant w-full (max-w-\w+) p-8 max-h-\[90vh\] overflow-y-auto( relative)?"/g,
    'className="bg-surface-container-lowest border border-outline-variant w-full $1 p-4 sm:p-8 max-h-[90vh] overflow-y-auto relative"'
  );

  fs.writeFileSync(file, content);
}
