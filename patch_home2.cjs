const fs = require('fs');
let code = fs.readFileSync('src/pages/store/Home.tsx', 'utf-8');

const staticMapRegex = /\{CATEGORIES\.map\(cat => \(\s*<button\s*key=\{cat\}\s*onClick=\{\(\) => setActiveCategory\(cat\)\}\s*className=\{`([^`]+)`\}\s*>\s*\{cat\}\s*<\/button>\s*\)\)\}/;

const dynamicMap = `{[ {id: 'all', name: 'All'}, ...categories ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.name)}
              className={\`$1\`}
            >
              {cat.name}
            </button>
          ))}`;

code = code.replace(staticMapRegex, dynamicMap);

fs.writeFileSync('src/pages/store/Home.tsx', code);
