const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes("WishlistPage")) {
  code = code.replace(
    "import ProductPage from './pages/store/ProductPage';",
    "import ProductPage from './pages/store/ProductPage';\nimport WishlistPage from './pages/store/WishlistPage';"
  );
  
  code = code.replace(
    "<Route path=\"product/:id\" element={<ProductPage />} />",
    "<Route path=\"product/:id\" element={<ProductPage />} />\n          <Route path=\"wishlist\" element={<WishlistPage />} />"
  );
  
  fs.writeFileSync('src/App.tsx', code);
  console.log("App.tsx patched");
}
