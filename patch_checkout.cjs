const fs = require('fs');
const file = 'src/components/store/CheckoutModal.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
    '<span>৳{deliveryCharge}</span>',
    '<span>{deliveryCharge === 0 ? "FREE" : `৳${deliveryCharge}`}</span>'
);

fs.writeFileSync(file, code);
