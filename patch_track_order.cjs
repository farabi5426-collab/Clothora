const fs = require('fs');
let code = fs.readFileSync('src/pages/store/TrackOrder.tsx', 'utf8');

code = code.replace("import StoreLayout from '../../components/store/layouts/StoreLayout';\n", "");
code = code.replace(/<StoreLayout>/, "");
code = code.replace(/<\/StoreLayout>/, "");

fs.writeFileSync('src/pages/store/TrackOrder.tsx', code);
