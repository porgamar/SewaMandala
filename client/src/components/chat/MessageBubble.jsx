export default function MessageBubble({ message, isMine }) {
  return (
    <div
      style={{
        textAlign: isMine ? "right" : "left",
        marginBottom: "12px",
      }}
    >
      <span
        style={{
          background: isMine ? "#007bff" : "#e4e6eb",
          color: isMine ? "white" : "black",
          padding: "10px 14px",
          borderRadius: "12px",
          display: "inline-block",
          maxWidth: "70%",
          wordBreak: "break-word",
        }}
      >
        {message.text}
      </span>
    </div>
  );
}