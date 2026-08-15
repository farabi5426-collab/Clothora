const fs = require('fs');
let code = fs.readFileSync('src/pages/store/Home.tsx', 'utf-8');

// Remove static CATEGORIES array
code = code.replace(/const CATEGORIES = \[.*\];\n/, '');

// Add categories state
code = code.replace(
  'const [products, setProducts] = useState<Product[]>([]);',
  `const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);`
);

// Add categories fetch
const useEffectProducts = `  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'), limit(12));`;

const useEffectCategories = `  useEffect(() => {
    const cq = query(collection(db, 'categories'), orderBy('name', 'asc'));
    const unsubC = onSnapshot(cq, (snapshot) => {
      const cats: {id: string, name: string}[] = [];
      snapshot.forEach(doc => cats.push({ id: doc.id, ...doc.data() } as any));
      setCategories(cats);
    });
    return () => unsubC();
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'), limit(12));`;

code = code.replace(useEffectProducts, useEffectCategories);

// Replace CATEGORIES.map with categories state mapping
const staticMap = `{CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={\`px-6 py-2 rounded-full border border-outline-variant text-xs md:text-sm font-bold uppercase tracking-widest transition-all duration-300 \${
                activeCategory === cat`;

const dynamicMap = `{[ {id: 'all', name: 'All'}, ...categories ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.name)}
              className={\`px-6 py-2 rounded-full border border-outline-variant text-xs md:text-sm font-bold uppercase tracking-widest transition-all duration-300 \${
                activeCategory === cat.name`;

code = code.replace(staticMap, dynamicMap);

// Replace `{cat}` with `{cat.name}` in the button body
// wait, the staticMap replacement has an open `{` which we need to make sure closes correctly. Let's do it differently.
