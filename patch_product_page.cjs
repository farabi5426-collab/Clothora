const fs = require('fs');

let content = fs.readFileSync('src/pages/store/ProductPage.tsx', 'utf-8');

// Import Video icon if not imported
if (!content.includes('Video')) {
  content = content.replace(
    'import { ShoppingCart, ArrowLeft, Star, TrendingUp, Check, Copy, Ruler, Shield, Truck } from \'lucide-react\';',
    'import { ShoppingCart, ArrowLeft, Star, TrendingUp, Check, Copy, Ruler, Shield, Truck, Video } from \'lucide-react\';'
  );
}

// Interface
content = content.replace(
  '  imageUrls?: string[];',
  '  imageUrls?: string[];\n  videoUrl?: string;'
);

// We need to set activeImageIndex to -1 if there is a video and we want it to be the default. Or just 0 if no video.
// But the user might prefer video to be the default. Let's just leave it at 0 (first image), but if they click the video thumbnail it goes to -1.
content = content.replace(
  'const [activeImageIndex, setActiveImageIndex] = useState(0);',
  'const [activeImageIndex, setActiveImageIndex] = useState(0);\n  useEffect(() => {\n    // if we just loaded product and it has videoUrl, maybe default to video?\n    // setActiveImageIndex(0);\n  }, [product]);'
);

const oldImageDisplay = `            <div className="w-full aspect-[3/4] relative border border-outline-variant mt-10 sm:mt-0">
              <img 
                src={product.imageUrls?.[activeImageIndex] || product.imageUrl} 
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
            {product.imageUrls && product.imageUrls.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {product.imageUrls.map((url, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={\`w-20 h-24 flex-shrink-0 border transition-all \${activeImageIndex === idx ? 'border-primary opacity-100' : 'border-outline-variant opacity-50 hover:opacity-100'}\`}
                  >
                    <img src={url} alt={\`\${product.title} \${idx+1}\`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}`;

const newImageDisplay = `            <div className="w-full aspect-[3/4] relative border border-outline-variant mt-10 sm:mt-0 bg-surface-container-lowest">
              {activeImageIndex === -1 && product.videoUrl ? (
                <video src={product.videoUrl} className="w-full h-full object-cover" autoPlay loop muted playsInline controls />
              ) : (
                <img 
                  src={product.imageUrls?.[activeImageIndex] || product.imageUrl} 
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            
            {(product.imageUrls || product.videoUrl) && (
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mt-2">
                {product.videoUrl && (
                  <button 
                    onClick={() => setActiveImageIndex(-1)}
                    className={\`w-20 h-24 flex-shrink-0 border transition-all relative overflow-hidden bg-black \${activeImageIndex === -1 ? 'border-primary opacity-100' : 'border-outline-variant opacity-60 hover:opacity-100'}\`}
                  >
                    <video src={product.videoUrl} className="w-full h-full object-cover opacity-50" muted playsInline />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Video className="w-6 h-6 text-white drop-shadow-md" />
                    </div>
                  </button>
                )}
                {product.imageUrls && product.imageUrls.map((url, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={\`w-20 h-24 flex-shrink-0 border transition-all overflow-hidden \${activeImageIndex === idx ? 'border-primary opacity-100' : 'border-outline-variant opacity-60 hover:opacity-100'}\`}
                  >
                    <img src={url} alt={\`\${product.title} \${idx+1}\`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}`;

content = content.replace(oldImageDisplay, newImageDisplay);

fs.writeFileSync('src/pages/store/ProductPage.tsx', content);
