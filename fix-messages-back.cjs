const fs = require('fs');

let content = fs.readFileSync('src/pages/admin/MessagesManagement.tsx', 'utf8');

// Add ArrowLeft import if missing
if (!content.includes('ArrowLeft')) {
    content = content.replace(
      /import \{ Send, User, Reply, CornerDownRight, X \} from 'lucide-react';/,
      "import { Send, User, Reply, CornerDownRight, X, ArrowLeft } from 'lucide-react';"
    );
}

// Replace material symbol
content = content.replace(
  /<span className="material-symbols-outlined">arrow_back<\/span>/,
  '<ArrowLeft className="w-6 h-6" />'
);

fs.writeFileSync('src/pages/admin/MessagesManagement.tsx', content);
