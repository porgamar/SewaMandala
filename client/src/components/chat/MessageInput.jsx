import { useState } from "react";

export default function MessageInput({ onSend }) {
  const [text, setText] = useState("");

  function send() {
    if (!text.trim()) return;

    onSend(text);
    setText("");
  }

  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
      }}
    >
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") send();
        }}
        placeholder="Type a message..."
        style={{
          flex: 1,
          padding: "10px",
        }}
      />

      <button onClick={send}>Send</button>
    </div>
  );
}