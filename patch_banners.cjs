const fs = require('fs');

let content = fs.readFileSync('src/pages/admin/BannersManagement.tsx', 'utf-8');

// Add source to BannerVideo
content = content.replace(
  '  createdAt: any;',
  '  createdAt: any;\n  source?: "hero" | "product";\n  productId?: string;'
);

// We need two states and combine them.
content = content.replace(
  '  const [videos, setVideos] = useState<BannerVideo[]>([]);',
  '  const [heroVideos, setHeroVideos] = useState<BannerVideo[]>([]);\n  const [productVideos, setProductVideos] = useState<BannerVideo[]>([]);\n  const videos = [...heroVideos, ...productVideos];'
);

// Add productVideos fetch and update heroVideos state update
content = content.replace(
  'const unsubscribe = onSnapshot(q, (snapshot) => {',
  'const unsubscribe = onSnapshot(q, (snapshot) => {'
);
content = content.replace(
  'vids.push({ id: doc.id, ...doc.data() } as BannerVideo)',
  'vids.push({ id: doc.id, ...doc.data(), source: "hero" } as BannerVideo)'
);
content = content.replace(
  'setVideos(vids);',
  'setHeroVideos(vids);'
);

const productBannersEffect = `  useEffect(() => {
    const pq = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const unsubP = onSnapshot(pq, (snapshot) => {
      const pVids: BannerVideo[] = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        if (data.showInBanner && data.videoUrl) {
          pVids.push({ id: doc.id + '_product', url: data.videoUrl, createdAt: data.createdAt, source: "product", productId: doc.id });
        }
      });
      setProductVideos(pVids);
    });
    return () => unsubP();
  }, []);`;

content = content.replace(
  'return () => unsubscribe();\n  }, []);',
  'return () => unsubscribe();\n  }, []);\n\n' + productBannersEffect
);

// Update handleDelete to handle both
// We need to import updateDoc
content = content.replace(
  'import { collection, addDoc, onSnapshot, deleteDoc, doc, query, orderBy } from \'firebase/firestore\';',
  'import { collection, addDoc, onSnapshot, deleteDoc, updateDoc, doc, query, orderBy } from \'firebase/firestore\';'
);

const newHandleDelete = `  const handleDelete = async (video: BannerVideo) => {
    if (window.confirm('Are you sure you want to delete this video from the banner?')) {
      if (video.source === 'product' && video.productId) {
         await updateDoc(doc(db, 'products', video.productId), { showInBanner: false });
      } else {
         await deleteDoc(doc(db, 'heroVideos', video.id));
      }
    }
  };`;

content = content.replace(
  /  const handleDelete = async \(id: string\) => \{\s+if \(window.confirm\('Are you sure you want to delete this video\?'\)\) \{\s+await deleteDoc\(doc\(db, 'heroVideos', id\)\);\s+\}\s+\};/g,
  newHandleDelete
);

// Update onClick handler
content = content.replace(
  'onClick={() => handleDelete(video.id)}',
  'onClick={() => handleDelete(video)}'
);

// Add a badge to show if it's from a product
content = content.replace(
  '<td className="p-4 text-xs tracking-widest text-on-surface-variant max-w-xs truncate" title={video.url}>\n                  {video.url}\n                </td>',
  `<td className="p-4 text-xs tracking-widest text-on-surface-variant max-w-xs truncate" title={video.url}>
                  {video.url}
                  {video.source === 'product' && (
                    <span className="ml-2 bg-primary/20 text-primary px-2 py-1 text-[10px] rounded-full">Product</span>
                  )}
                </td>`
);

fs.writeFileSync('src/pages/admin/BannersManagement.tsx', content);
