import { useState } from "react";

const URL_API = import.meta.env.VITE_URL_API;

function ChatGPT() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");

  const sendMessage = async () => {
    const res = await fetch(URL_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    const data = await res.json();
    setReply(data.reply);
  };

  return (
    <div>
      <h2>Asistente IA</h2>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Escribe tu mensaje..."
      />
      <button onClick={sendMessage}>Enviar</button>
      {reply && <p><strong>IA:</strong> {reply}</p>}
    </div>
  );
}

export default ChatGPT;
