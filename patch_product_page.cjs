const fs = require('fs');
let code = fs.readFileSync('src/pages/store/ProductPage.tsx', 'utf8');

if(!code.includes("Related Products")) {
    // Add import for related products query
    code = code.replace(
      "import { doc, getDoc } from 'firebase/firestore';",
      "import { doc, getDoc, collection, query, where, getDocs, limit } from 'firebase/firestore';"
    );

    // Add state
    code = code.replace(
      "const [loading, setLoading] = useState(true);",
      "const [loading, setLoading] = useState(true);\n  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);"
    );

    // Update useEffect to fetch related
    const fetchRelatedStr = `
        if (prod.category) {
          const q = query(collection(db, 'products'), where('category', '==', prod.category), limit(5));
          const relatedSnap = await getDocs(q);
          const rel: Product[] = [];
          relatedSnap.forEach(doc => {
            if (doc.id !== prod.id) {
              rel.push({ id: doc.id, ...doc.data() } as Product);
            }
          });
          setRelatedProducts(rel.slice(0, 4));
        }
    `;
    code = code.replace(
      "setProduct(prod);\n      } else {",
      "setProduct(prod);\n" + fetchRelatedStr + "\n      } else {"
    );

    // Add UI at the bottom
    const relatedUI = `
      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-24 border-t-2 border-surface-bright pt-16">
          <h2 className="text-3xl font-black uppercase tracking-tighter mb-8 text-on-surface">You Might Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {relatedProducts.map(rel => (
              <Link to={\`/product/\${rel.id}\`} key={rel.id} className="group bg-surface-container-lowest border-2 border-surface-bright p-4 flex flex-col relative transition-transform hover:-translate-y-2 hover:shadow-[8px_8px_0px_var(--color-primary)] duration-200">
                <div className="w-full aspect-[3/4] bg-surface-container-low mb-4 relative overflow-hidden">
                  <img src={rel.imageUrl} alt={rel.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface line-clamp-2 mb-2">{rel.title}</h3>
                <div className="text-lg font-black text-primary mt-auto">৳{rel.price}</div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}`;
    
    // Find the end of the file and replace it
    const endOfFileRegex = /<\/div>\s*<\/div>\s*<\/div>\s*\);\s*\}/;
    if (endOfFileRegex.test(code)) {
      code = code.replace(endOfFileRegex, `</div>\n      </div>\n${relatedUI}`);
    } else {
      console.log("Could not find end of file for related products");
      // Just try to replace the last two closing divs
      const lastDivs = "</div>\n    </div>\n  );\n}";
      code = code.replace(lastDivs, `${relatedUI}`);
    }
    
    fs.writeFileSync('src/pages/store/ProductPage.tsx', code);
    console.log('ProductPage patched');
}
