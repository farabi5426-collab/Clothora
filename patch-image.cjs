const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

content = content.replace(
  "const imageUrl = product.imageUrl || '';",
  "const rawImageUrl = (product.imageUrls && product.imageUrls.length > 0) ? product.imageUrls[0] : (product.imageUrl || '');\n        const imageUrl = rawImageUrl.startsWith('http') ? rawImageUrl : ('https://' + req.get('host') + (rawImageUrl.startsWith('/') ? '' : '/') + rawImageUrl);"
);

fs.writeFileSync('server.ts', content);
