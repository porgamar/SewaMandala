import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { API_BASE } from "../config";

import { useEffect, useState } from "react";
import {
  sendMessage,
  subscribeToMessages,
} from "../firebase/chatService";
import { subscribeToChats } from "../firebase/chatService";
import ChatSidebar from "../components/chat/ChatSidebar";
import ChatWindow from "../components/chat/ChatWindow";

export default function Chat() {
  const { token, user } = useAuth();

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chats, setChats] = useState([]);

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
  if (!user) return;

  const unsubscribe = subscribeToChats((allChats) => {
    const myChats = allChats.filter((chat) =>
      chat.participants?.includes(user.id)
    );

    setChats(myChats);
  });

  return () => unsubscribe();
}, [user]);

  useEffect(() => {
    if (!selectedUser || !user) return;

    const unsubscribe = subscribeToMessages(
      user.id,
      selectedUser.id,
      setMessages
    );

    return () => unsubscribe();
  }, [selectedUser, user]);


  return (
     <div
    style={{
      display: "flex",
      height: "90vh",
    }}
  >
    <ChatSidebar
      users={users}
      selectedUser={selectedUser}
      setSelectedUser={setSelectedUser}
    />

      <ChatWindow
  selectedUser={selectedUser}
  messages={messages}
  user={user}
  onSend={async (text) => {
    if (!selectedUser) return;

    try {
      await sendMessage(user.id, selectedUser.id, text);
    } catch (err) {
      console.error(err);
    }
  }}
/>
</div>
  );
}

           
