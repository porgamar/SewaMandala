export default function ChatSidebar({
  users,
  selectedUser,
  setSelectedUser,
  onNewChat,
}) {
  return (
    <div
      style={{
        width: "300px",
        borderRight: "1px solid #ddd",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "15px",
          borderBottom: "1px solid #ddd",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2
          style={{
            margin: 0,
          }}
        >
          Chats
        </h2>

        <button
          onClick={onNewChat}
          style={{
            padding: "6px 12px",
            border: "none",
            borderRadius: "6px",
            background: "#007bff",
            color: "white",
            cursor: "pointer",
          }}
        >
          + New
        </button>
      </div>

      {/* Chat List */}
      <div
        style={{
          overflowY: "auto",
          flex: 1,
        }}
      >
        {users.length === 0 ? (
          <div
            style={{
              padding: "20px",
              textAlign: "center",
              color: "#888",
            }}
          >
            No conversations yet.
          </div>
        ) : (
          users.map((u) => (
            <div
              key={u.id}
              onClick={() => setSelectedUser(u)}
              style={{
                padding: "15px",
                cursor: "pointer",
                borderBottom: "1px solid #eee",
                backgroundColor:
                  selectedUser?.id === u.id
                    ? "#f0f8ff"
                    : "white",
              }}
            >
              <strong>{u.full_name || u.email}</strong>

              <br />

              <span
                style={{
                  color: "#777",
                  fontSize: "14px",
                }}
              >
                {u.user_type}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}