const fs = require('fs');
const file = 'src/components/store/CheckoutModal.tsx';
let code = fs.readFileSync(file, 'utf8');

const oldMap = `items: items.map(item => ({
          id: item.id || '',
          title: item.title || 'Untitled',
          quantity: item.quantity || 1,
          price: item.price || 0,
        }))`;

const newMap = `items: items.map(item => ({
          id: item.id || '',
          title: item.title || 'Untitled',
          quantity: item.quantity || 1,
          price: item.price || 0,
          imageUrl: item.imageUrl || '',
        }))`;

code = code.replace(oldMap, newMap);
fs.writeFileSync(file, code);
