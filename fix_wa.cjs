const fs = require('fs');
let code = fs.readFileSync('src/components/store/WhatsAppButton.tsx', 'utf8');

code = code.replace(
  "const whatsappUrl = \\`https://wa.me/\\${phoneNumber.replace(/\\\\D/g, '')}?text=\\${encodeURIComponent(message)}\\`;",
  "const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\\D/g, '')}?text=${encodeURIComponent(message)}`;"
);

fs.writeFileSync('src/components/store/WhatsAppButton.tsx', code);
console.log("WA fixed");
