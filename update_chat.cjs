const fs = require('fs');

// --- 1. Update ChatWidget.tsx ---
let chatCode = fs.readFileSync('src/components/store/ChatWidget.tsx', 'utf8');

// replace state
chatCode = chatCode.replace(
  /const \[regEmail, setRegEmail\] = useState\(''\);/,
  `const [regPhone, setRegPhone] = useState('');`
);

// update handleRegister
chatCode = chatCode.replace(
  /if \(!regName \|\| !regEmail\) return;/,
  `if (!regName || !regPhone) return;
    const phoneStr = regPhone.replace(/[\\s-]/g, '');
    if (!/^(?:\\+88|88)?01[3-9]\\d{8}$/.test(phoneStr) && !/^\\+?[0-9]{10,15}$/.test(phoneStr)) {
      toast.error('Please enter a valid phone number');
      return;
    }`
);

// Ensure toast is imported if we use it, it should be already imported in ChatWidget? Let's check imports later, or just use alert if toast not available. But toast is heavily used.
// Let's check if toast is imported.
if (!chatCode.includes("from 'react-hot-toast'")) {
    chatCode = chatCode.replace(
        "import React, { useState, useEffect, useRef } from 'react';",
        "import React, { useState, useEffect, useRef } from 'react';\nimport toast from 'react-hot-toast';"
    );
}

// update setDoc in handleRegister
chatCode = chatCode.replace(
  /customerEmail: regEmail,/,
  `customerPhone: regPhone,`
);

// update setDoc in sendMessage
chatCode = chatCode.replace(
  /customerEmail: user\?\.email \|\| regEmail \|\| 'guest@example\.com',/,
  `customerPhone: regPhone || 'N/A',`
);

// update form inputs
chatCode = chatCode.replace(
  /<input required type="email" placeholder="YOUR EMAIL" value=\{regEmail\} onChange=\{\(e\) => setRegEmail\(e\.target\.value\)\} className="w-full bg-surface-container-low border border-outline-variant p-4 text-xs font-bold uppercase tracking-\[0\.1em\] text-on-background focus:border-primary outline-none rounded-none" \/>/,
  `<input required type="tel" placeholder="YOUR PHONE" value={regPhone} onChange={(e) => setRegPhone(e.target.value)} className="w-full bg-surface-container-low border border-outline-variant p-4 text-xs font-bold uppercase tracking-[0.1em] text-on-background focus:border-primary outline-none rounded-none" />`
);

fs.writeFileSync('src/components/store/ChatWidget.tsx', chatCode);

// --- 2. Update MessagesManagement.tsx ---
let adminCode = fs.readFileSync('src/pages/admin/MessagesManagement.tsx', 'utf8');

// update interface
adminCode = adminCode.replace(
  /customerEmail: string;/,
  `customerPhone?: string;
  customerEmail?: string;`
);

// update UI
adminCode = adminCode.replace(
  /<p className="text-xs text-on-surface-variant tracking-widest">\{selectedChat\.customerEmail\}<\/p>/,
  `<p className="text-xs text-on-surface-variant tracking-widest">{selectedChat.customerPhone || selectedChat.customerEmail}</p>`
);

fs.writeFileSync('src/pages/admin/MessagesManagement.tsx', adminCode);
console.log('Update complete');
