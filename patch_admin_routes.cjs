const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes("SocialLinksManagement")) {
  code = code.replace(
    "import BannersManagement from './pages/admin/BannersManagement';",
    "import BannersManagement from './pages/admin/BannersManagement';\nimport SocialLinksManagement from './pages/admin/SocialLinksManagement';"
  );
  
  code = code.replace(
    "<Route path=\"banners\" element={<BannersManagement />} />",
    "<Route path=\"banners\" element={<BannersManagement />} />\n          <Route path=\"social-links\" element={<SocialLinksManagement />} />"
  );
  
  fs.writeFileSync('src/App.tsx', code);
  console.log("App routes patched");
}
