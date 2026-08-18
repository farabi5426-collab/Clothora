const fs = require('fs');
const content = fs.readFileSync('src/pages/admin/DeliveryManagement.tsx', 'utf8');
const newImports = "import { doc, getDoc, setDoc, collection, getDocs, writeBatch } from 'firebase/firestore';";
let patched = content.replace("import { doc, getDoc, setDoc } from 'firebase/firestore';", newImports);

patched = patched.replace(
  "const [freeDelivery, setFreeDelivery] = useState<boolean>(false);",
  "const [freeDelivery, setFreeDelivery] = useState<boolean>(false);\n  const [initialFreeDelivery, setInitialFreeDelivery] = useState<boolean>(false);"
);

patched = patched.replace(
  "setFreeDelivery(docSnap.data().freeDelivery ?? false);",
  "setFreeDelivery(docSnap.data().freeDelivery ?? false);\n          setInitialFreeDelivery(docSnap.data().freeDelivery ?? false);"
);

const newSave = `
  const handleSave = async () => {
    setSaving(true);
    try {
      if (freeDelivery !== initialFreeDelivery) {
        // Toggle prices for all products
        const productsSnapshot = await getDocs(collection(db, 'products'));
        const batch = writeBatch(db);
        let count = 0;
        
        productsSnapshot.forEach((productDoc) => {
          const productData = productDoc.data();
          const currentPrice = typeof productData.price === 'number' ? productData.price : parseFloat(productData.price) || 0;
          
          let newPrice = currentPrice;
          if (freeDelivery && !initialFreeDelivery) {
            newPrice = currentPrice + 120;
          } else if (!freeDelivery && initialFreeDelivery) {
            newPrice = Math.max(0, currentPrice - 120);
          }
          
          batch.update(productDoc.ref, { price: newPrice });
          count++;
          
          // Firestore limits batch to 500, assuming < 500 products here.
          // In a larger app, we'd chunk this.
        });
        
        if (count > 0) {
          await batch.commit();
        }
        
        setInitialFreeDelivery(freeDelivery);
      }

      await setDoc(doc(db, 'settings', 'delivery'), {
        insideDhaka,
        outsideDhaka,
        freeDelivery
      }, { merge: true });
      
      alert('Delivery settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save. Make sure you are an admin.');
    } finally {
      setSaving(false);
    }
  };
`;

patched = patched.replace(/const handleSave = async \(\) => \{[\s\S]*?finally \{\s*setSaving\(false\);\s*\}\s*\};/, newSave.trim());

fs.writeFileSync('src/pages/admin/DeliveryManagement.tsx', patched);
