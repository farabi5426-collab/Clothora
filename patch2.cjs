const fs = require('fs');
let code = fs.readFileSync('src/components/store/CartDrawer.tsx', 'utf8');

const oldApplyPromoRegex = /const applyPromo = \(\) => \{[\s\S]*?toast\.error\('Error applying promo code\.'\);\s*\}\s*\};/;

const newApplyPromo = `const applyPromo = async () => {
    if (!promoCode.trim()) return;

    try {
      const q = query(collection(db, 'promoCodes'), where('code', '==', promoCode.toUpperCase()));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        if (promoCode.toUpperCase() === 'CLOTHORA10') {
          const discount = subtotal * 0.1;
          setDiscountAmount(discount);
          setPromoApplied(true);
          toast.success('Promo code applied successfully!');
          return;
        }
        toast.error('Invalid promo code');
        return;
      }

      const promoDoc = querySnapshot.docs[0];
      const promoData = promoDoc.data();

      if (promoData.isActive === false) {
        toast.error('Promo code is disabled');
        return;
      }
      if (subtotal < promoData.minOrderAmount) {
        toast.error(\`Minimum order amount is ৳\${promoData.minOrderAmount}\`);
        return;
      }
      if (promoData.expiryDate && new Date(promoData.expiryDate) < new Date()) {
        toast.error('Promo code has expired');
        return;
      }

      const discount = (subtotal * promoData.discountPercent) / 100;
      setDiscountAmount(discount);
      setPromoApplied(true);
      toast.success('Promo code applied successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Error applying promo code.');
    }
  };`;

if (oldApplyPromoRegex.test(code)) {
    code = code.replace(oldApplyPromoRegex, newApplyPromo);
    
    // Also add imports if not there
    if (!code.includes('getDocs')) {
      code = code.replace(
        "import { doc, getDoc } from 'firebase/firestore';",
        "import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';"
      );
    }
    
    fs.writeFileSync('src/components/store/CartDrawer.tsx', code);
    console.log("Success");
} else {
    console.log("Regex didn't match");
}
