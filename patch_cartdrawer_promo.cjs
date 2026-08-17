const fs = require('fs');
let code = fs.readFileSync('src/components/store/CartDrawer.tsx', 'utf8');

// Replace imports
code = code.replace(
  "import { doc, getDoc } from 'firebase/firestore';",
  "import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';"
);

// Replace applyPromo
const oldApplyPromo = `  const applyPromo = () => {
    if (!promoCode.trim()) return;

    try {
      if (promoCode.toUpperCase() === 'CLOTHORA10') {
        const discount = subtotal * 0.1;
        setDiscountAmount(discount);
        setPromoApplied(true);
        toast.success('Promo code applied successfully!');
      } else {
        toast.error('Invalid promo code');
      }
    } catch (error) {
      toast.error('Error applying promo code.');
    }
  };`;

const newApplyPromo = `  const applyPromo = async () => {
    if (!promoCode.trim()) return;

    try {
      const q = query(collection(db, 'promoCodes'), where('code', '==', promoCode.toUpperCase()));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        // Fallback for hardcoded if needed, but we want it fully dynamic now
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

code = code.replace(oldApplyPromo, newApplyPromo);

fs.writeFileSync('src/components/store/CartDrawer.tsx', code);
