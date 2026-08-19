const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

// Replace the naive replace logic with something better
const oldLogic = "html = html.replace('<title>Clothora</title>', metaTags);";
const newLogic = `
        // Remove existing default meta tags
        html = html.replace(/<title>.*<\\/title>/g, '');
        html = html.replace(/<meta name="description".*?>/g, '');
        html = html.replace(/<meta property="og:.*?".*?>/g, '');
        html = html.replace(/<meta name="twitter:.*?".*?>/g, '');
        
        // Inject new tags before </head>
        html = html.replace('</head>', metaTags + '\\n  </head>');
`;

content = content.replace(oldLogic, newLogic);
fs.writeFileSync('server.ts', content);
