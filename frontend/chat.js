
// frontend/chat.js
const socket = io("http://localhost:3000");

const messagesDiv = document.getElementById("messages");
const input = document.getElementById("chatInput");
const sendBtn = document.getElementById("sendBtn");

sendBtn.addEventListener("click", () => {
  const msg = input.value.trim();
  if (msg !== "") {
    socket.emit("chatMessage", msg);
    input.value = "";
  }
});

socket.on("chatMessage", (msg) => {
  const p = document.createElement("p");
  p.textContent = msg;
  messagesDiv.appendChild(p);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
});
