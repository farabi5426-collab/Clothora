async function main() {
  const url = 'https://firestore.googleapis.com/v1/projects/gen-lang-client-0228474543/databases/ai-studio-clothora-036904d7-3e54-49fd-8153-c3b75b405ae1/documents/products?key=AIzaSyDgGPhYbqdDeIEigXx7YP_n19F8XX0eNMw';
  
  const res = await fetch(url);
  const data = await res.json();
  
  const targetTitles = [
    "BARCELONA AND REAL MADRID STREETWEAR DROP IS HERE! ⚽🔥",
    "REAL MADRID \"ACID WASH\" DROP SHOULDER T-SHIRT! 👑⚽",
    "PREMIUM ACID WASH DROP SHOULDER TSHIRT"
  ];
  
  const docsToUpdate = data.documents.filter(doc => {
    const title = doc.fields.title?.stringValue || "";
    return targetTitles.includes(title) || title.includes("BARCELONA") || title.includes("REAL MADRID") || title.includes("PREMIUM ACID WASH");
  });
  
  console.log("Found docs to update:", docsToUpdate.map(d => ({id: d.name, title: d.fields.title.stringValue})));
  
  // Patch each doc
  for (const doc of docsToUpdate) {
    const docUrl = `https://firestore.googleapis.com/v1/${doc.name}?updateMask.fieldPaths=category&key=AIzaSyDgGPhYbqdDeIEigXx7YP_n19F8XX0eNMw`;
    const patchBody = {
      fields: {
        category: {
          stringValue: "Drop Shoulder T-Shirt"
        }
      }
    };
    
    const patchRes = await fetch(docUrl, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patchBody)
    });
    
    console.log("Patched", doc.name, "Status:", patchRes.status);
    const patchData = await patchRes.json();
    console.log("Response:", patchData);
  }
}

main().catch(console.error);
