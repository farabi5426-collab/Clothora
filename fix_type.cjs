const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) { 
      results.push(file);
    }
  });
  return results;
}

const files = walk('./src');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Replace instances
  let newContent = content.replace(/bg-primary\s+text-on-background/g, 'bg-primary text-on-primary');
  newContent = newContent.replace(/text-on-background\s+bg-primary/g, 'text-on-primary bg-primary');
  newContent = newContent.replace(/bg-primary(?:\s+hover:[^\s]+)*\s+text-on-background/g, (match) => {
    return match.replace('text-on-background', 'text-on-primary');
  });
  
  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    console.log('Fixed', file);
  }
});
