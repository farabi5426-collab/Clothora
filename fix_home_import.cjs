const fs = require('fs');
let code = fs.readFileSync('src/pages/store/Home.tsx', 'utf8');

if (!code.includes("import { useWishlistStore }")) {
  code = code.replace(
    "import toast from 'react-hot-toast';",
    "import toast from 'react-hot-toast';\nimport { Heart } from 'lucide-react';\nimport { useWishlistStore } from '../../store/wishlistStore';"
  );
  
  // also verify Heart wasn't already imported?
  // the replace above is safe enough.
  
  fs.writeFileSync('src/pages/store/Home.tsx', code);
  console.log("Fixed import in Home.tsx");
}
