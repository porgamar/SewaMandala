function formatTime(timestamp) {
  if (!timestamp) return "";

  const date = timestamp.toDate();
  const now = new Date();

  const messageDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const time = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (messageDay.getTime() === today.getTime()) {
    return time;
  }

  if (messageDay.getTime() === yesterday.getTime()) {
    return `Yesterday ${time}`;
  }

  return date.toLocaleDateString([], {
    month: "short",
    day: "numeric",
  }) + ` ${time}`;
}
export default function MessageBubble({ message, isMine }) {
  return (
    <div
      style={{
        textAlign: isMine ? "right" : "left",
        marginBottom: "12px",
      }}
    >
      <div
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
        <div>{message.text}</div>

        <div
          style={{
            fontSize: "11px",
            marginTop: "5px",
            opacity: 0.7,
            textAlign: "right",
          }}
        >
          {formatTime(message.createdAt)}
        </div>
      </div>
    </div>
  );
}