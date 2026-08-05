export default function ChatSidebar({
  users,
  selectedUser,
  setSelectedUser,
}) {
  return (
    <div
      style={{
        width: "300px",
        borderRight: "1px solid #ddd",
      }}
    >
      <h1>Chats</h1>

      {users.map((u) => (
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

          {u.user_type}
        </div>
      ))}
    </div>
  );
}