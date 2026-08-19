const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

// The replacement logic
const oldLogic = /const title = product\.title \+ ' \| Clothora';\s*const description = product\.description \|\| `Buy \$\{product\.title\} at Clothora`;/;
const newLogic = `
        const escapeHtml = (str) => {
          if (!str) return '';
          return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/\\n/g, ' ')
            .replace(/\\r/g, ' ');
        };
        const title = escapeHtml(product.title + ' | Clothora');
        const description = escapeHtml(product.description || \`Buy \${product.title} at Clothora\`).substring(0, 200);
`;

content = content.replace(oldLogic, newLogic);
fs.writeFileSync('server.ts', content);
