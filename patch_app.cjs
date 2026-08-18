const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes("LegalPages")) {
    code = code.replace(
        "import CustomerDashboard from './pages/store/CustomerDashboard';",
        "import CustomerDashboard from './pages/store/CustomerDashboard';\nimport LegalPages from './pages/store/LegalPages';"
    );
    
    code = code.replace(
        "<Route path=\"/account\" element={<CustomerDashboard />} />",
        "<Route path=\"/account\" element={<CustomerDashboard />} />\n          <Route path=\"/policies/:policyType\" element={<LegalPages />} />"
    );
    
    fs.writeFileSync('src/App.tsx', code);
    console.log("App patched");
}
