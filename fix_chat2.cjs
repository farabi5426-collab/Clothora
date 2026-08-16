const fs = require('fs');
const file = './src/components/store/ChatWidget.tsx';
let content = fs.readFileSync(file, 'utf8');

// revert everything back to text-on-background
content = content.replace(/text-on-primary/g, 'text-on-background');

// then strictly replace bg-primary text-on-background with bg-primary text-on-primary
content = content.replace(/bg-primary\s+text-on-background/g, 'bg-primary text-on-primary');
content = content.replace(/text-on-background\s+bg-primary/g, 'text-on-primary bg-primary');
content = content.replace(/bg-primary(?:\s+hover:[^\s]+)*\s+text-on-background/g, (match) => {
  return match.replace('text-on-background', 'text-on-primary');
});

// and the header parts which have bg-primary at line 113:
// <div className="flex items-center justify-between p-5 bg-primary">
// The inner texts should be text-on-primary
content = content.replace(/<h3 className="text-xl font-black uppercase tracking-tighter text-on-background m-0 leading-none">/, '<h3 className="text-xl font-black uppercase tracking-tighter text-on-primary m-0 leading-none">');
content = content.replace(/<p className="text-\[11px\] text-on-background\/90 mt-1\.5 font-medium tracking-wide">/, '<p className="text-[11px] text-on-primary/90 mt-1.5 font-medium tracking-wide">');
content = content.replace(/<button onClick=\{\(\) => setIsOpen\(false\)\} className="text-on-background hover:text-on-background\/70/g, '<button onClick={() => setIsOpen(false)} className="text-on-primary hover:text-on-primary/70');

fs.writeFileSync(file, content, 'utf8');
