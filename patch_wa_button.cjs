const fs = require('fs');
let code = fs.readFileSync('src/components/store/WhatsAppButton.tsx', 'utf8');

const newCode = `import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Facebook, Instagram } from 'lucide-react';

interface SocialLinksConfig {
  whatsapp: { url: string; enabled: boolean };
  facebook: { url: string; enabled: boolean };
  instagram: { url: string; enabled: boolean };
}

export default function WhatsAppButton() {
  const [config, setConfig] = useState<SocialLinksConfig | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'settings', 'socialLinks'));
        if (docSnap.exists()) {
          setConfig(docSnap.data() as SocialLinksConfig);
        } else {
          setConfig({
            whatsapp: { url: '+8801234567890', enabled: true },
            facebook: { url: '', enabled: false },
            instagram: { url: '', enabled: false },
          });
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchConfig();
  }, []);

  if (!config) return null;

  return (
    <div className="fixed bottom-6 left-6 z-[100] flex flex-col gap-3">
      {config.instagram?.enabled && config.instagram.url && (
        <a
          href={config.instagram.url}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#E4405F] text-white p-3 rounded-full shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:scale-110 transition-transform flex items-center justify-center group"
        >
          <Instagram className="w-8 h-8" />
        </a>
      )}
      
      {config.facebook?.enabled && config.facebook.url && (
        <a
          href={config.facebook.url}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#1877F2] text-white p-3 rounded-full shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:scale-110 transition-transform flex items-center justify-center group"
        >
          <Facebook className="w-8 h-8 fill-current" />
        </a>
      )}
      
      {config.whatsapp?.enabled && config.whatsapp.url && (
        <a
          href={\`https://wa.me/\${config.whatsapp.url.replace(/\\D/g, '')}?text=\${encodeURIComponent('Hello Clothora, I need some help!')}\`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#25D366] text-white p-3 rounded-full shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:scale-110 transition-transform flex items-center justify-center group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="w-8 h-8 fill-current">
            <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157.1zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
          </svg>
        </a>
      )}
    </div>
  );
}
`;

fs.writeFileSync('src/components/store/WhatsAppButton.tsx', newCode);
console.log("Social widget replaced");
