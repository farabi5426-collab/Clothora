const fs = require('fs');
let content = fs.readFileSync('src/pages/store/Home.tsx', 'utf-8');
content = content.replace(
  'function ProductCard({ product, openProductDetails, handleAddToCart }: { product: Product, openProductDetails: (p: Product) => void, handleAddToCart: (e: React.MouseEvent, p: Product) => void }) {',
  'const ProductCard: React.FC<{ product: Product, openProductDetails: (p: Product) => void, handleAddToCart: (e: React.MouseEvent, p: Product) => void }> = ({ product, openProductDetails, handleAddToCart }) => {'
);
// replace closing bracket for ProductCard
// we need to find the end of ProductCard which is right before export default function Home() {
content = content.replace(
  /    <\/div>\n  \);\n}\n\nexport default function Home\(\) {/,
  '    </div>\n  );\n};\n\nexport default function Home() {'
);
fs.writeFileSync('src/pages/store/Home.tsx', content);
