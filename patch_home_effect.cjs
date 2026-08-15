const fs = require('fs');
let code = fs.readFileSync('src/pages/store/Home.tsx', 'utf-8');

const effectCategories = `
  useEffect(() => {
    const cq = query(collection(db, 'categories'), orderBy('name', 'asc'));
    const unsubC = onSnapshot(cq, (snapshot) => {
      const cats: {id: string, name: string}[] = [];
      snapshot.forEach(doc => cats.push({ id: doc.id, ...doc.data() } as any));
      setCategories(cats);
    });
    return () => unsubC();
  }, []);
`;

code = code.replace(
  'const filteredProducts = activeCategory === "All"',
  effectCategories + '\n  const filteredProducts = activeCategory === "All"'
);

fs.writeFileSync('src/pages/store/Home.tsx', code);
