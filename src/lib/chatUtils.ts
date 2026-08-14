export const getChatId = () => {
  let chatId = localStorage.getItem('clothora_chat_id');
  if (!chatId) {
    chatId = 'chat_' + Math.random().toString(36).substr(2, 9) + Date.now();
    localStorage.setItem('clothora_chat_id', chatId);
  }
  return chatId;
};
