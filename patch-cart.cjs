const fs = require('fs');
let code = fs.readFileSync('src/components/store/CartDrawer.tsx', 'utf8');

const oldDiscountLogic = "const discount = (subtotal * promoData.discountPercent) / 100;";
const newDiscountLogic = `let discount = 0;
      if (promoData.discountAmount && promoData.discountAmount > 0) {
        discount = promoData.discountAmount;
      } else if (promoData.discountPercent && promoData.discountPercent > 0) {
        discount = (subtotal * promoData.discountPercent) / 100;
      }`;

code = code.replace(oldDiscountLogic, newDiscountLogic);
fs.writeFileSync('src/components/store/CartDrawer.tsx', code);
