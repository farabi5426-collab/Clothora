const fs = require('fs');
let code = fs.readFileSync('src/pages/store/ProductPage.tsx', 'utf8');

const oldFetch = `    async function fetchProduct() {
      if (!id) return;
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() } as Product);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    }`;

const newFetch = `    async function fetchProduct() {
      if (!id) return;
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const prod = { id: docSnap.id, ...docSnap.data() } as Product;
          setProduct(prod);
          
          if (prod.category) {
            const q = query(collection(db, 'products'), where('category', '==', prod.category), limit(5));
            const relatedSnap = await getDocs(q);
            const rel = [];
            relatedSnap.forEach(doc => {
              if (doc.id !== prod.id) {
                rel.push({ id: doc.id, ...doc.data() });
              }
            });
            setRelatedProducts(rel.slice(0, 4));
          }
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    }`;

code = code.replace(oldFetch, newFetch);
fs.writeFileSync('src/pages/store/ProductPage.tsx', code);
console.log('Related products query patched');
