const fs = require('fs');

let content = fs.readFileSync('src/pages/store/Home.tsx', 'utf-8');

// Update state to handle product banner videos
content = content.replace(
  'const [heroVideos, setHeroVideos] = useState<{id: string, url: string}[]>([]);',
  'const [heroVideos, setHeroVideos] = useState<{id: string, url: string}[]>([]);\n  const [productBannerVideos, setProductBannerVideos] = useState<{id: string, url: string}[]>([]);'
);

// We'll calculate the combined videos locally
const getCombinedVideosStr = `  const combinedHeroVideos = [...heroVideos, ...productBannerVideos];\n`;

content = content.replace(
  'const filteredProducts = activeCategory === "All"',
  getCombinedVideosStr + '\n  const filteredProducts = activeCategory === "All"'
);

// Instead of replacing all 'heroVideos.length', we can just replace 'heroVideos' with 'combinedHeroVideos' inside the specific components. But wait, `heroVideos` is also used in useEffect. Let's just redefine `heroVideos` to be the combined array, and use separate states for the db results.

content = content.replace(
  '  const [heroVideos, setHeroVideos] = useState<{id: string, url: string}[]>([]);',
  '  const [heroDbVideos, setHeroDbVideos] = useState<{id: string, url: string}[]>([]);\n  const [productBannerVideos, setProductBannerVideos] = useState<{id: string, url: string}[]>([]);\n  const heroVideos = [...heroDbVideos, ...productBannerVideos];'
);

// Now change the setHeroVideos inside the useEffect to setHeroDbVideos
content = content.replace(
  'setHeroVideos(vids);',
  'setHeroDbVideos(vids);'
);

// Add the product fetch query for banners inside the same useEffect or next to it
const productBannersEffect = `  useEffect(() => {
    const pq = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const unsubP = onSnapshot(pq, (snapshot) => {
      const pVids: {id: string, url: string}[] = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        if (data.showInBanner && data.videoUrl) {
          pVids.push({ id: doc.id, url: data.videoUrl });
        }
      });
      setProductBannerVideos(pVids);
    });
    return () => unsubP();
  }, []);`;

content = content.replace(
  "return () => unsubV();\n  }, []);",
  "return () => unsubV();\n  }, []);\n\n" + productBannersEffect
);

fs.writeFileSync('src/pages/store/Home.tsx', content);
