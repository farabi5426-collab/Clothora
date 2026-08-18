const fs = require('fs');
let code = fs.readFileSync('src/components/store/CheckoutModal.tsx', 'utf8');

if (!code.includes("getDoc(doc(db, 'users', user.uid))")) {
    code = code.replace(
        "import { collection, addDoc } from 'firebase/firestore';",
        "import { collection, addDoc, getDoc, doc } from 'firebase/firestore';\nimport { useEffect } from 'react';"
    );
    
    const useEffectStr = `
  useEffect(() => {
    const fetchProfile = async () => {
      if (user && isOpen) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setFormData(prev => ({
              ...prev,
              name: data.name || prev.name,
              phone: data.phone || prev.phone,
              address: data.address || prev.address
            }));
          }
        } catch (e) {
          console.error('Error fetching profile for checkout', e);
        }
      }
    };
    fetchProfile();
  }, [user, isOpen]);
  `;
  
    code = code.replace(
      "const total = subtotal - discount + deliveryCharge;",
      "const total = subtotal - discount + deliveryCharge;\n" + useEffectStr
    );
    
    fs.writeFileSync('src/components/store/CheckoutModal.tsx', code);
    console.log("Checkout autofill added");
}
