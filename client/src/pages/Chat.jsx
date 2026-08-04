import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { API_BASE } from "../config";

import { useEffect, useState } from "react";
import {
  sendMessage,
  subscribeToMessages,
} from "../firebase/chatService";


export default function Chat() {
  const { token, user } = useAuth();

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadUsers() {
      try {
        const { data } = await axios.get(`${API_BASE}/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUsers(data);
      } catch (err) {
        console.error(err);
      }
    }

    if (token) {
      loadUsers();
    }
  }, [token]);

  useEffect(() => {
    if (!selectedUser || !user) return;

    const unsubscribe = subscribeToMessages(
      user.id,
      selectedUser.id,
      setMessages
    );

    return () => unsubscribe();
  }, [selectedUser, user]);

  async function handleSend() {
  if (!message.trim()) return;
  if (!selectedUser) return;

  try {
    console.log({
      sender: user.id,
      receiver: selectedUser.id,
      message,
    });

    await sendMessage(
      user.id,
      selectedUser.id,
      message
    );

    setMessage("");
  } catch (err) {
    console.error("Error sending message:", err);
  }
}
  return (
    <div
      style={{
        display: "flex",
        height: "90vh",
      }}
    >
      <div
        style={{
          width: "300px",
          borderRight: "1px solid #ddd",
        }}
      >
        <h2>Chats</h2>

        {users.map((u) => (
          <div
            key={u.id}
            onClick={() => setSelectedUser(u)}
            style={{
              padding: "15px",
              cursor: "pointer",
              borderBottom: "1px solid #eee",
            }}
          >
            <strong>{u.full_name || u.email}</strong>

            <br />

            {u.user_type}
          </div>
        ))}
      </div>

      <div
        style={{
          flex: 1,
          padding: "20px",
        }}
      >
        {!selectedUser && <h2>Select a conversation</h2>}

        {selectedUser && (
          <>
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
                <div
                  key={msg.id}
                  style={{
                    textAlign:
                      msg.senderId === user.id
                        ? "right"
                        : "left",
                    marginBottom: "12px",
                  }}
                >
                  <span
                    style={{
                      background:
                        msg.senderId === user.id
                          ? "#007bff"
                          : "#e4e6eb",
                      color:
                        msg.senderId === user.id
                          ? "white"
                          : "black",
                      padding: "10px 14px",
                      borderRadius: "12px",
                      display: "inline-block",
                    }}
                  >
                    {msg.text}
                  </span>
                </div>
              ))}
            </div>

            <div
              style={{
                display: "flex",
                gap: "10px",
              }}
            >
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSend();
                }}
                placeholder="Type a message..."
                style={{
                  flex: 1,
                  padding: "10px",
                }}
              />

              <button
  onClick={() => {
    console.log("Button clicked");
    handleSend();
  }}
>
  Send
</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
