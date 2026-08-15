const fs = require('fs');
let content = fs.readFileSync('src/pages/admin/MessagesManagement.tsx', 'utf-8');

// Replace the main flex container
// from: <div className="flex-1 bg-surface-container-lowest border border-outline-variant flex overflow-hidden">
// to: same, but inner divs change.

// Sidebar
content = content.replace(
  '<div className="w-1/3 border-r border-outline-variant flex flex-col">',
  '<div className={`w-full md:w-1/3 border-r border-outline-variant flex flex-col ${selectedChat ? "hidden md:flex" : "flex"}`}>'
);

// Chat Area
content = content.replace(
  '<div className="flex-1 flex flex-col bg-background">',
  '<div className={`flex-1 flex flex-col bg-background ${!selectedChat ? "hidden md:flex" : "flex"}`}>'
);

// Add a back button in the chat header for mobile
const chatHeaderStr = `<div className="w-10 h-10 bg-black rounded-full flex items-center justify-center border border-outline-variant text-on-background">`;
const newChatHeaderStr = `<button onClick={() => setSelectedChat(null)} className="md:hidden text-on-surface-variant hover:text-on-background mr-2"><span className="material-symbols-outlined">arrow_back</span></button>
                <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center border border-outline-variant text-on-background">`;

content = content.replace(chatHeaderStr, newChatHeaderStr);

fs.writeFileSync('src/pages/admin/MessagesManagement.tsx', content);
