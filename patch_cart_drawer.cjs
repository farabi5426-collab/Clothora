const fs = require('fs');
const file = 'src/components/store/CartDrawer.tsx';
let code = fs.readFileSync(file, 'utf8');

if (!code.includes('import { db } from')) {
    code = code.replace("import React, { useState }", "import React, { useState, useEffect }");
    code = code.replace("import CheckoutModal from './CheckoutModal';", "import CheckoutModal from './CheckoutModal';\nimport { db } from '../../lib/firebase';\nimport { doc, getDoc } from 'firebase/firestore';");
}

code = code.replace(
    "const [deliveryZone, setDeliveryZone] = useState<'inside' | 'outside' | null>(null);",
    "const [deliveryZone, setDeliveryZone] = useState<'inside' | 'outside' | null>(null);\n  const [deliverySettings, setDeliverySettings] = useState({ insideDhaka: 60, outsideDhaka: 120, freeDelivery: false });\n\n  useEffect(() => {\n    if (isCartOpen) {\n      getDoc(doc(db, 'settings', 'delivery')).then(docSnap => {\n        if (docSnap.exists()) {\n          setDeliverySettings({ \n            insideDhaka: docSnap.data().insideDhaka ?? 60, \n            outsideDhaka: docSnap.data().outsideDhaka ?? 120,\n            freeDelivery: docSnap.data().freeDelivery ?? false\n          });\n        }\n      });\n    }\n  }, [isCartOpen]);"
);

code = code.replace(
    "const deliveryCharge = deliveryZone === 'inside' ? 60 : deliveryZone === 'outside' ? 120 : 0;",
    "const deliveryCharge = deliverySettings.freeDelivery ? 0 : (deliveryZone === 'inside' ? deliverySettings.insideDhaka : deliveryZone === 'outside' ? deliverySettings.outsideDhaka : 0);"
);

fs.writeFileSync(file, code);
