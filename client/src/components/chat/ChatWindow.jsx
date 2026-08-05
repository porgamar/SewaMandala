import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";

export default function ChatWindow({
  selectedUser,
  messages,
  user,
  onSend,
}) {
  if (!selectedUser) {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h2>Select a conversation</h2>
      </div>
    );
  }

  return (
    <div
      style={{
        flex: 1,
        padding: "20px",
      }}
    >
      <h2>{selectedUser.full_name || selectedUser.email}</h2>

      <hr />

      <div
        style={{
          height: "70%",
          overflowY: "auto",
          marginBottom: "20px",
        }}
      >
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isMine={msg.senderId === user.id}
          />
        ))}
      </div>

      <MessageInput onSend={onSend} />
    </div>
  );
}