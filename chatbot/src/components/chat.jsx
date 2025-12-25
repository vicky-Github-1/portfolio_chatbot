import { useState, useRef, useEffect } from "react";
import "./chat.css";

export default function WhatsAppChat() {
  const [messages, setMessages] = useState([
  {
    sender: "bot",
    text: "Hi 👋 I’m Shubham’s AI assistant. How can I help you today?"
  }
]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    setLoading(true);
    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: data.reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Something went wrong. Try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container shadow d-flex flex-column">
      {/* HEADER */}
      <div className="chat-header text-center fw-bold">
        Ask Me Anything 🤖
      </div>

      {/* BODY */}
      <div className="chat-body">
        {messages.map((m, i) => (
          <div key={i} className={`bubble ${m.sender}`}>
            {m.text}
          </div>
        ))}

        {loading && (
          <div className="bubble bot typing">typing...</div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <div className="chat-input d-flex align-items-center gap-2">
        <input
          className="form-control chat-textbox"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          className="btn btn-success rounded-circle send-btn"
          onClick={sendMessage}
          disabled={loading}
        >
          ➤
        </button>
      </div>
    </div>
  );
}
