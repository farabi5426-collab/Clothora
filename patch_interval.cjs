const fs = require('fs');
let code = fs.readFileSync('src/pages/store/Home.tsx', 'utf8');

code = code.replace(
  "    const interval = setInterval(() => {\n      setCurrentImageIndex((prev) => (prev + 1) % images.length);\n    }, 3000);",
  "    const interval = setInterval(() => {\n      setCurrentImageIndex((prev) => (prev + 1) % images.length);\n    }, 5000);"
);

fs.writeFileSync('src/pages/store/Home.tsx', code);
console.log('Interval updated to 5000ms');
