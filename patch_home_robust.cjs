const fs = require('fs');

let content = fs.readFileSync('src/pages/store/Home.tsx', 'utf-8');

// 1. Remove absolute positioning from heading
content = content.replace(
  'className="absolute left-0 top-0 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-on-background uppercase tracking-tighter leading-none drop-shadow-2xl flex flex-col w-full"',
  'className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-on-background uppercase tracking-tighter leading-none drop-shadow-2xl flex flex-col w-full"'
);

// Remove the fixed height wrapper for heading, let it naturally size
content = content.replace(
  '<div className="h-[120px] sm:h-[140px] md:h-[200px] lg:h-[240px] relative mb-6">',
  '<div className="relative mb-6 min-h-[120px] md:min-h-[150px]">'
);

// 2. Remove absolute positioning from paragraph
content = content.replace(
  'className="absolute left-0 top-0 text-base md:text-xl text-on-surface-variant font-bold drop-shadow-lg leading-relaxed"',
  'className="text-base md:text-xl text-on-surface-variant font-bold drop-shadow-lg leading-relaxed"'
);

// Remove the fixed height wrapper for paragraph, let it naturally size
content = content.replace(
  '<div className="h-[120px] sm:h-[100px] md:h-[140px] relative mb-12 max-w-[650px]">',
  '<div className="relative mb-12 max-w-[650px] min-h-[80px] md:min-h-[100px]">'
);

fs.writeFileSync('src/pages/store/Home.tsx', content);
