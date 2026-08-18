import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, initializeFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "AIzaSyDgGPhYbqdDeIEigXx7YP_n19F8XX0eNMw",
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "gen-lang-client-0228474543.firebaseapp.com",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || "gen-lang-client-0228474543",
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "gen-lang-client-0228474543.firebasestorage.app",
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "662231425255",
  appId: process.env.VITE_FIREBASE_APP_ID || "1:662231425255:web:67dd1ac6e4b025ac7a0242"
};

const appInstance = initializeApp(firebaseConfig);
const db = initializeFirestore(appInstance, { experimentalForceLongPolling: true }, "ai-studio-clothora-036904d7-3e54-49fd-8153-c3b75b405ae1");

async function startServer() {
  const app = express();
  const PORT = 3000;

  let vite: any = null;
  if (process.env.NODE_ENV !== "production") {
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
  }

  // Handle product route for OG tags
  app.get('/product/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
      const docRef = doc(db, 'products', id);
      const docSnap = await getDoc(docRef);
      
      let html = '';
      if (process.env.NODE_ENV !== "production") {
        html = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf-8');
        html = await vite.transformIndexHtml(req.url, html);
      } else {
        html = fs.readFileSync(path.resolve(process.cwd(), 'dist/index.html'), 'utf-8');
      }

      if (docSnap.exists()) {
        const product = docSnap.data();
        const title = product.title + ' | Clothora';
        const description = product.description || `Buy ${product.title} at Clothora`;
        const rawImageUrl = (product.imageUrls && product.imageUrls.length > 0) ? product.imageUrls[0] : (product.imageUrl || '');
        const imageUrl = rawImageUrl.startsWith('http') ? rawImageUrl : ('https://' + req.get('host') + (rawImageUrl.startsWith('/') ? '' : '/') + rawImageUrl);
        const url = 'https://' + req.get('host') + req.originalUrl;
        
        const metaTags = `
          <title>${title}</title>
          <meta name="title" content="${title}">
          <meta name="description" content="${description}">
          
          <meta property="og:type" content="product">
          <meta property="og:url" content="${url}">
          <meta property="og:title" content="${title}">
          <meta property="og:description" content="${description}">
          <meta property="og:image" content="${imageUrl}">
          <meta property="og:image:width" content="1200">
          <meta property="og:image:height" content="630">
          
          <meta name="twitter:card" content="summary_large_image">
          <meta name="twitter:url" content="${url}">
          <meta name="twitter:title" content="${title}">
          <meta name="twitter:description" content="${description}">
          <meta name="twitter:image" content="${imageUrl}">
        `;
        
        // Remove existing default meta if possible, then inject our dynamic ones
        html = html.replace('<title>Clothora</title>', metaTags);
      }
      
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (e) {
      console.error(e);
      next(e);
    }
  });

  if (process.env.NODE_ENV !== "production") {
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
