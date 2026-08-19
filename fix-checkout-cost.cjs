const fs = require('fs');

const path = 'src/components/store/CheckoutModal.tsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(
/selectedSize: item\.selectedSize \|\| '',\n          selectedColor: item\.selectedColor \|\| '',\n        }\)\),/g,
`selectedSize: item.selectedSize || '',
          selectedColor: item.selectedColor || '',
          costPrice: item.costPrice || 0,
        })),`
);

fs.writeFileSync(path, code);
