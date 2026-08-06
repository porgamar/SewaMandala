import { useEffect, useState } from "react";
import axios from "axios";

import { API_BASE } from "../../config";
import { useAuth } from "../../context/AuthContext";

export default function NewChatModal({
  open,
  onClose,
  onSelectUser,
}) {
  const { token } = useAuth();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!open) return;

    async function loadUsers() {
      try {
        const { data } = await axios.get(
          `${API_BASE}/users`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUsers(data);
      } catch (err) {
        console.error(err);
      }
    }

    loadUsers();
  }, [open, token]);

  if (!open) return null;

  const filtered = users.filter((u) =>
    (u.full_name || u.email)
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.4)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: 450,
          background: "white",
          borderRadius: 10,
          padding: 20,
        }}
      >
        <h2>New Chat</h2>

        <input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: 10,
            marginBottom: 20,
          }}
        />

        <div
          style={{
            maxHeight: 350,
            overflowY: "auto",
          }}
        >
          {filtered.map((user) => (
            <div
              key={user.id}
              onClick={() => {
                onSelectUser(user);
                onClose();
              }}
              style={{
                padding: 12,
                cursor: "pointer",
                borderBottom: "1px solid #eee",
              }}
            >
              <strong>
                {user.full_name || user.email}
              </strong>

              <br />

              {user.user_type}
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          style={{
            marginTop: 20,
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}