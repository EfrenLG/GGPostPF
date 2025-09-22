// React
import { useState } from "react";

// Servicios y funciones
import userService from "../../services/api";

// Estilos
import './ChatGPT.css';

function ChatGPT() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;

    setLoading(true);
    try {
      const { data } = await userService.chatWithAI(message);
      setReply(data.reply);
    } catch (error) {
      console.error("Error al comunicar con IA:", error);
      setReply("Hubo un error al obtener la respuesta de la IA 😢");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Asistente IA</h2>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Actualmente deshabilitado..."
        disabled
      />
      <button onClick={sendMessage} disabled={loading}>
        {loading ? "Enviando..." : "Enviar"}
      </button>
      {reply && (
        <p>
          <strong>IA:</strong> {reply}
        </p>
      )}
    </div>
  );
}

export default ChatGPT;
