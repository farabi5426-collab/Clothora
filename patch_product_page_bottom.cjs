const fs = require('fs');
let code = fs.readFileSync('src/pages/store/ProductPage.tsx', 'utf8');

const oldEnd = `        </div>
      </div>
    </main>
  );
}`;

const newEnd = `        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-24 border-t border-outline-variant pt-16">
          <h2 className="text-3xl font-black uppercase tracking-tighter mb-8 text-on-surface">You Might Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {relatedProducts.map(rel => (
              <Link to={\`/product/\${rel.id}\`} key={rel.id} className="group bg-surface-container-lowest border border-outline-variant p-4 flex flex-col relative transition-transform hover:-translate-y-2 hover:shadow-[8px_8px_0px_var(--color-primary)] duration-200">
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
    </main>
  );
}`;

code = code.replace(oldEnd, newEnd);
fs.writeFileSync('src/pages/store/ProductPage.tsx', code);
console.log("Patched related products");
