const API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3";
const API_KEY = "give your api key , example: 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";

const chat = document.getElementById('chat');
const input = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');

function appendMessage(role, text) {
  const messageEl = document.createElement('div');
  messageEl.className = 'message ' + role;

  const icon = document.createElement('img');
  icon.className = 'icon';
  icon.src = role === 'user'
    ? 'https://img.icons8.com/ios-filled/50/user.png'
    : 'https://img.icons8.com/ios-filled/50/computer.png';

  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.innerText = text;

  if (role === 'user') {
    messageEl.appendChild(bubble);
    messageEl.appendChild(icon);
  } else {
    messageEl.appendChild(icon);
    messageEl.appendChild(bubble);
  }

  chat.appendChild(messageEl);
  chat.scrollTop = chat.scrollHeight;
}

async function sendMessage() {
  const userText = input.value.trim();
  if (!userText) return;

  appendMessage('user', userText);
  input.value = '';
  input.disabled = true;
  sendBtn.disabled = true;

  const prompt = `You are a computer science teacher. Only answer computer-related questions in a clear and helpful way. If the question is not about computers, politely refuse to answer.\n\nStudent: ${userText}\nTeacher:`;

  appendMessage('bot', 'Typing...');

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ inputs: prompt })
    });

    const data = await response.json();
    const replyText = data[0]?.generated_text?.split('Teacher:')[1]?.trim() || "Sorry, I couldn't generate a response.";

    document.querySelector('.message.bot:last-child').remove();
    appendMessage('bot', replyText);

  } catch (error) {
    document.querySelector('.message.bot:last-child').remove();
    appendMessage('bot', "Error: Unable to contact the AI. Try again later.");
    console.error(error);
  }

  input.disabled = false;
  sendBtn.disabled = false;
  input.focus();
}

sendBtn.addEventListener('click', sendMessage);
input.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});
