const fs = require('fs');

let content = fs.readFileSync('src/pages/store/Home.tsx', 'utf-8');

// Add video states and imports if missing
if (!content.includes('heroVideos')) {
  // we need to add the heroVideos fetch inside the component
  content = content.replace(
    '  const [heroIndex, setHeroIndex] = useState(0);',
    `  const [heroIndex, setHeroIndex] = useState(0);\n  const [heroVideos, setHeroVideos] = useState<{id: string, url: string}[]>([]);\n  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);`
  );

  content = content.replace(
    /  useEffect\(\(\) => \{\n    const q = query\(collection\(db, 'products'\), orderBy\('createdAt', 'desc'\), limit\(12\)\);/,
    `  useEffect(() => {
    const vq = query(collection(db, 'heroVideos'), orderBy('createdAt', 'desc'));
    const unsubV = onSnapshot(vq, (snapshot) => {
      const vids: {id: string, url: string}[] = [];
      snapshot.forEach(doc => vids.push({ id: doc.id, url: doc.data().url }));
      setHeroVideos(vids);
    });
    return () => unsubV();
  }, []);

  useEffect(() => {
    if (heroVideos.length <= 1) return;
    const vidInterval = setInterval(() => {
      setCurrentVideoIndex(prev => (prev + 1) % heroVideos.length);
    }, 6000); // switch video every 6 seconds
    return () => clearInterval(vidInterval);
  }, [heroVideos.length]);

  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'), limit(12));`
  );
  
  // Now modify the hero section layout
  // Find: <div className="relative z-10 w-full max-w-[1920px] mx-auto px-4 md:px-16 pt-24 pb-32 flex flex-col justify-end min-h-[70vh]">
  const oldHeroStart = `<div className="relative z-10 w-full max-w-[1920px] mx-auto px-4 md:px-16 pt-24 pb-32 flex flex-col justify-end min-h-[70vh]">`;
  const newHeroStart = `<div className="relative z-10 w-full max-w-[1920px] mx-auto px-4 md:px-16 pt-24 pb-32 min-h-[70vh] flex flex-col md:flex-row items-center md:items-end justify-between gap-12">
          <div className="flex flex-col justify-end w-full md:w-1/2">`;
          
  content = content.replace(oldHeroStart, newHeroStart);
  
  // Find the end of the hero flex col:
  const oldHeroEnd = `            </a>
          </div>
        </div>
      </section>`;
  
  const newHeroEnd = `            </a>
          </div>
        </div>
        <div className="w-full md:w-1/2 flex justify-center md:justify-end items-center h-[300px] sm:h-[400px] md:h-[500px]">
          {heroVideos.length > 0 ? (
            <div className="relative w-full max-w-[500px] aspect-[4/5] sm:aspect-square md:aspect-[4/5] overflow-visible">
              {/* Glowing animated border effect */}
              <div className="absolute -inset-2 bg-gradient-to-r from-primary via-[#ff8800] to-primary rounded-sm opacity-70 blur-md animate-pulse"></div>
              <div className="absolute -inset-1 bg-gradient-to-tr from-primary to-transparent rounded-sm animate-[spin_4s_linear_infinite] opacity-50"></div>
              
              <div className="absolute inset-0 bg-surface-container-lowest border-2 border-primary/50 shadow-[0_0_30px_var(--color-primary)] overflow-hidden rounded-sm z-10">
                <AnimatePresence mode="wait">
                  <motion.video 
                    key={currentVideoIndex}
                    src={heroVideos[currentVideoIndex].url}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    autoPlay 
                    muted 
                    loop 
                    playsInline 
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>
                
                {/* Dots indicator for videos */}
                {heroVideos.length > 1 && (
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
                    {heroVideos.map((_, idx) => (
                      <div 
                        key={idx} 
                        className={\`h-1.5 transition-all duration-300 \${idx === currentVideoIndex ? 'w-6 bg-primary' : 'w-2 bg-white/50'}\`} 
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="hidden md:block w-full max-w-[500px] aspect-[4/5] border border-outline-variant/30 border-dashed opacity-20"></div>
          )}
        </div>
      </div>
      </section>`;
  
  content = content.replace(oldHeroEnd, newHeroEnd);

  fs.writeFileSync('src/pages/store/Home.tsx', content);
}
