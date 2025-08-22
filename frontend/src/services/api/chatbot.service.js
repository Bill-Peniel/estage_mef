import axios from 'axios';
 
export async function sendChatbotMessage(message) {
  const res = await axios.post('/api/chatbot', { message });
  return res.data.answer;
} 