const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const regex = /html\.replace\('<title>Vite \+ React \+ TS<\/title>', metaTags\);/;
const newCode = `
        const defaultMeta = \`
    <title>Clothora</title>
    <meta name="description" content="Premium streetwear engineered for the modern void." />
    <meta property="og:title" content="Clothora" />
    <meta property="og:description" content="Premium streetwear engineered for the modern void." />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image" />\`;
        
        // Remove existing default meta if possible, then inject our dynamic ones
        html = html.replace('<title>Clothora</title>', metaTags);
`;
content = content.replace(regex, newCode);
fs.writeFileSync('server.ts', content);
