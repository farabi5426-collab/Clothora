const fs = require('fs');
let content = fs.readFileSync('src/pages/store/Home.tsx', 'utf-8');

// Remove duplicate state declarations manually using a regex to replace exactly the block around line 168-171
content = content.replace(
  /const \[heroDbVideos, setHeroDbVideos\] = useState<\{id: string, url: string\}\[\]>\(\[\]\);\n\s*const \[productBannerVideos, setProductBannerVideos\] = useState<\{id: string, url: string\}\[\]>\(\[\]\);\n\s*const heroVideos = \[\.\.\.heroDbVideos, \.\.\.productBannerVideos\];\n\s*const \[productBannerVideos, setProductBannerVideos\] = useState<\{id: string, url: string\}\[\]>\(\[\]\);/g,
  'const [heroDbVideos, setHeroDbVideos] = useState<{id: string, url: string}[]>([]);\n  const [productBannerVideos, setProductBannerVideos] = useState<{id: string, url: string}[]>([]);\n  const heroVideos = [...heroDbVideos, ...productBannerVideos];'
);

// We also have a random 'combinedHeroVideos' at line 269 that is causing unused variable warnings probably, let's remove it if it's there
content = content.replace(
  /  const combinedHeroVideos = \[\.\.\.heroVideos, \.\.\.productBannerVideos\];\n/g,
  ''
);

fs.writeFileSync('src/pages/store/Home.tsx', content);
