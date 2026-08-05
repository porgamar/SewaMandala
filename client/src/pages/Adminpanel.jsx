import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API_BASE = "http://localhost:5000";

function MessagesTable() {
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | forbidden | unauthenticated | error
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setStatus("unauthenticated");
        return;
      }
      try {
        const res = await fetch(`${API_BASE}/api/contact`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 403) {
          setStatus("forbidden");
          return;
        }
        if (res.status === 401) {
          setStatus("unauthenticated");
          return;
        }
        if (!res.ok) {
          setStatus("error");
          return;
        }
        const data = await res.json();
        setMessages(data);
        setStatus("ready");
      } catch {
        setStatus("error");
      }
    };
    load();
  }, []);

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    setDeletingId(id);
    try {
      const res = await fetch(`${API_BASE}/api/contact/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
      }
    } finally {
      setDeletingId(null);
    }
  };

  if (status === "loading") {
    return <p className="text-sm text-gray-500">Loading messages...</p>;
  }

  if (status === "unauthenticated") {
    return (
      <div className="bg-[#f5f5f4] border border-black/10 rounded-xl p-6 text-center">
        <p className="text-sm text-gray-500">Please log in to view this page.</p>
      </div>
    );
  }

  if (status === "forbidden") {
    return (
      <div className="bg-[#f5f5f4] border border-black/10 rounded-xl p-6 text-center">
        <p className="text-black font-medium mb-1">Admin access required</p>
        <p className="text-sm text-gray-500">This account isn't an admin.</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="bg-[#f5f5f4] border border-black/10 rounded-xl p-6 text-center">
        <p className="text-sm text-[#c26a1f]">
          Couldn't load messages. Check that the server is running.
        </p>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="bg-[#f5f5f4] border border-black/10 rounded-xl p-6 text-center">
        <p className="text-sm text-gray-500">No messages yet.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {messages.map((m) => (
        <div key={m.id} className="bg-[#f5f5f4] border border-black/10 rounded-xl p-5">
          <div className="flex items-center justify-between mb-2 flex-wrap gap-1">
            <span className="font-semibold text-black">{m.name}</span>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500">
                {new Date(m.created_at).toLocaleString()}
              </span>
              <button
                onClick={() => handleDelete(m.id)}
                disabled={deletingId === m.id}
                className="text-xs text-[#c26a1f] hover:underline disabled:opacity-50"
              >
                {deletingId === m.id ? "Removing..." : "Remove"}
              </button>
            </div>
          </div>
          <p className="text-sm text-[#4881E3] mb-2">{m.email}</p>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{m.message}</p>
        </div>
      ))}
    </div>
  );
}

function AddUserForm({ onAdded }) {
  const [form, setForm] = useState({ email: "", password: "", userType: "client" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_BASE}/api/admin/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not add user");
        return;
      }
      onAdded(data);
      setForm({ email: "", password: "", userType: "client" });
    } catch {
      setError("Could not reach the server");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#f5f5f4] border border-black/10 rounded-xl p-5 flex flex-col sm:flex-row gap-3 sm:items-end mb-6"
    >
      <div className="flex flex-col gap-1.5 flex-1">
        <label className="text-xs uppercase tracking-widest text-gray-500">Email</label>
        <input
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="bg-white border border-black/10 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:border-[#4881E3] transition"
        />
      </div>
      <div className="flex flex-col gap-1.5 flex-1">
        <label className="text-xs uppercase tracking-widest text-gray-500">Password</label>
        <input
          type="password"
          required
          minLength={6}
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="bg-white border border-black/10 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:border-[#4881E3] transition"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs uppercase tracking-widest text-gray-500">Type</label>
        <select
          value={form.userType}
          onChange={(e) => setForm({ ...form, userType: e.target.value })}
          className="bg-white border border-black/10 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:border-[#4881E3] transition"
        >
          <option value="client">Client</option>
          <option value="talent">Talent</option>
        </select>
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="rounded-lg bg-[#4881E3] text-white font-semibold text-sm py-2.5 px-5 hover:bg-[#5c90e8] disabled:opacity-60 transition"
      >
        {submitting ? "Adding..." : "Add user"}
      </button>
      {error && <p className="text-sm text-[#c26a1f] sm:basis-full">{error}</p>}
    </form>
  );
}

function UsersTable() {
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState("loading");
  const [deletingId, setDeletingId] = useState(null);

  const load = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setStatus("unauthenticated");
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 403) {
        setStatus("forbidden");
        return;
      }
      if (res.status === 401) {
        setStatus("unauthenticated");
        return;
      }
      if (!res.ok) {
        setStatus("error");
        return;
      }
      const data = await res.json();
      setUsers(data);
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    setDeletingId(id);
    try {
      const res = await fetch(`${API_BASE}/api/admin/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u.id !== id));
      }
    } finally {
      setDeletingId(null);
    }
  };

  if (status === "loading") {
    return <p className="text-sm text-gray-500">Loading users...</p>;
  }

  if (status === "unauthenticated") {
    return (
      <div className="bg-[#f5f5f4] border border-black/10 rounded-xl p-6 text-center">
        <p className="text-sm text-gray-500">Please log in to view this page.</p>
      </div>
    );
  }

  if (status === "forbidden") {
    return (
      <div className="bg-[#f5f5f4] border border-black/10 rounded-xl p-6 text-center">
        <p className="text-black font-medium mb-1">Admin access required</p>
        <p className="text-sm text-gray-500">This account isn't an admin.</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="bg-[#f5f5f4] border border-black/10 rounded-xl p-6 text-center">
        <p className="text-sm text-[#c26a1f]">
          Couldn't load users. Check that the server is running.
        </p>
      </div>
    );
  }

  return (
    <>
      <AddUserForm onAdded={(newUser) => setUsers((prev) => [newUser, ...prev])} />

      {users.length === 0 ? (
        <div className="bg-[#f5f5f4] border border-black/10 rounded-xl p-6 text-center">
          <p className="text-sm text-gray-500">No users yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {users.map((u) => (
            <div
              key={u.id}
              className="bg-[#f5f5f4] border border-black/10 rounded-xl p-4 flex items-center justify-between flex-wrap gap-2"
            >
              <div>
                <span className="font-medium text-black">{u.email}</span>
                <span className="text-xs text-gray-500 ml-2 uppercase tracking-widest">
                  {u.user_type}
                </span>
              </div>
              <button
                onClick={() => handleDelete(u.id)}
                disabled={deletingId === u.id}
                className="text-xs text-[#c26a1f] hover:underline disabled:opacity-50"
              >
                {deletingId === u.id ? "Removing..." : "Remove"}
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function AdminPanel() {
  const [tab, setTab] = useState("messages"); // messages | users
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/home");
  };

  return (
    <div className="min-h-screen bg-white text-black px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#4881E3] mb-1">Admin</p>
            <h1 className="text-2xl font-semibold text-black">Dashboard</h1>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-500 hover:text-black transition"
          >
            Log out
          </button>
        </div>

        <div className="flex gap-2 mb-8 border-b border-black/10">
          <button
            onClick={() => setTab("messages")}
            className={`text-sm font-medium px-3 py-2 -mb-px border-b-2 transition ${
              tab === "messages"
                ? "border-[#4881E3] text-black"
                : "border-transparent text-gray-500 hover:text-black"
            }`}
          >
            Contact messages
          </button>
          <button
            onClick={() => setTab("users")}
            className={`text-sm font-medium px-3 py-2 -mb-px border-b-2 transition ${
              tab === "users"
                ? "border-[#4881E3] text-black"
                : "border-transparent text-gray-500 hover:text-black"
            }`}
          >
            Users
          </button>
        </div>

        {tab === "messages" ? <MessagesTable /> : <UsersTable />}
      </div>
    </div>
  );
}

export default AdminPanel;