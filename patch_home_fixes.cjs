const fs = require('fs');

let content = fs.readFileSync('src/pages/store/Home.tsx', 'utf-8');

// 1. Fix the heading container height and font size
content = content.replace(
  '<div className="h-[90px] sm:h-[110px] md:h-[160px] lg:h-[200px] relative mb-6">',
  '<div className="h-[120px] sm:h-[140px] md:h-[200px] lg:h-[240px] relative mb-6">'
);

content = content.replace(
  'className="absolute left-0 top-0 text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-on-background uppercase tracking-tighter leading-none drop-shadow-2xl flex flex-col w-full"',
  'className="absolute left-0 top-0 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-on-background uppercase tracking-tighter leading-none drop-shadow-2xl flex flex-col w-full"'
);

// 2. Fix the description container height
content = content.replace(
  '<div className="min-h-[140px] sm:min-h-[100px] relative mb-12 max-w-[650px]">',
  '<div className="h-[120px] sm:h-[100px] md:h-[140px] relative mb-12 max-w-[650px]">'
);

// 3. Fix the video container size, corners, and aspect ratio
content = content.replace(
  '<div className="w-full md:w-1/2 flex justify-center md:justify-end items-center h-[300px] sm:h-[400px] md:h-[500px]">',
  '<div className="w-full md:w-1/2 flex justify-center md:justify-end items-center h-auto mt-8 md:mt-0">'
);

content = content.replace(
  '<div className="relative w-full max-w-[500px] aspect-[4/5] sm:aspect-square md:aspect-[4/5] overflow-visible">',
  '<div className="relative w-full max-w-[280px] sm:max-w-[360px] md:max-w-[400px] aspect-[3/4] overflow-visible">'
);

// update rounded-sm to rounded-[2rem] everywhere in the video borders
// There are three instances of rounded-sm in the glowing border effects
content = content.replace(
  '<div className="absolute -inset-2 bg-gradient-to-r from-primary via-[#ff8800] to-primary rounded-sm opacity-70 blur-md animate-pulse"></div>',
  '<div className="absolute -inset-2 bg-gradient-to-r from-primary via-[#ff8800] to-primary rounded-[2rem] opacity-70 blur-md animate-pulse"></div>'
);

content = content.replace(
  '<div className="absolute -inset-1 bg-gradient-to-tr from-primary to-transparent rounded-sm animate-[spin_4s_linear_infinite] opacity-50"></div>',
  '<div className="absolute -inset-1 bg-gradient-to-tr from-primary to-transparent rounded-[2rem] animate-[spin_4s_linear_infinite] opacity-50"></div>'
);

content = content.replace(
  '<div className="absolute inset-0 bg-surface-container-lowest border-2 border-primary/50 shadow-[0_0_30px_var(--color-primary)] overflow-hidden rounded-sm z-10">',
  '<div className="absolute inset-0 bg-surface-container-lowest border-2 border-primary/50 shadow-[0_0_30px_var(--color-primary)] overflow-hidden rounded-[2rem] z-10">'
);

fs.writeFileSync('src/pages/store/Home.tsx', content);
