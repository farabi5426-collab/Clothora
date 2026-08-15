const fs = require('fs');

// Fix Home.tsx
let homeContent = fs.readFileSync('src/pages/store/Home.tsx', 'utf-8');

// Remove duplicate state declaration
homeContent = homeContent.replace(
  'const [heroVideos, setHeroVideos] = useState<{id: string, url: string}[]>([]);\n  const [productBannerVideos, setProductBannerVideos] = useState<{id: string, url: string}[]>([]);\n  const [heroDbVideos, setHeroDbVideos] = useState<{id: string, url: string}[]>([]);\n  const [productBannerVideos, setProductBannerVideos] = useState<{id: string, url: string}[]>([]);',
  'const [heroDbVideos, setHeroDbVideos] = useState<{id: string, url: string}[]>([]);\n  const [productBannerVideos, setProductBannerVideos] = useState<{id: string, url: string}[]>([]);'
);

// If it looks different, let's just do a clean replace using a regex
homeContent = homeContent.replace(
  /const \[heroVideos, setHeroVideos\] = useState<\{id: string, url: string\}\[\]>\(\[\]\);\n\s*const \[productBannerVideos, setProductBannerVideos\] = useState<\{id: string, url: string\}\[\]>\(\[\]\);/g,
  ''
);

// We need to ensure we only have ONE declaration of productBannerVideos
// Let's do a strict find and replace for the exact lines if we can find them.
fs.writeFileSync('src/pages/store/Home.tsx', homeContent);

// Fix ProductPage.tsx (missing Video icon import)
let productContent = fs.readFileSync('src/pages/store/ProductPage.tsx', 'utf-8');
if (!productContent.includes('Video,') && !productContent.includes('Video }')) {
  productContent = productContent.replace(
    /import \{([^}]+)\} from 'lucide-react';/,
    (match, p1) => {
       if (p1.includes('Video')) return match;
       return `import { ${p1}, Video } from 'lucide-react';`;
    }
  );
  fs.writeFileSync('src/pages/store/ProductPage.tsx', productContent);
}

