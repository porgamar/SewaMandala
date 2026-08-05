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
import NewChatModal from "../components/chat/NewChatModal";

export default function Chat() {
  const { token, user } = useAuth();

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chats, setChats] = useState([]);
  const [showNewChat, setShowNewChat] = useState(false);

 

 useEffect(() => {
  if (!user || !token) return;

  const unsubscribe = subscribeToChats(async (allChats) => {
    // Only chats that belong to me
    const myChats = allChats.filter((chat) =>
      chat.participants?.includes(user.id)
    );

    setChats(myChats);

    // Get the ID of the other participant in each chat
    const otherUserIds = myChats.map((chat) =>
      chat.participants.find((id) => id !== user.id)
    );

    // Remove duplicates
    const uniqueIds = [...new Set(otherUserIds)];

    // If I have no chats, empty the sidebar
    if (uniqueIds.length === 0) {
      setUsers([]);
      return;
    }

    try {
      const { data } = await axios.post(
        `${API_BASE}/users/by-ids`,
        {
          ids: uniqueIds,
        },
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
  });

  return () => unsubscribe();
}, [user, token]);

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
        onNewChat={() => setShowNewChat(true)}

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

    <NewChatModal
  open={showNewChat}
  onClose={() => setShowNewChat(false)}
  onSelectUser={(user) => {
    setSelectedUser(user);
  }}
/>
</div>
  );
}

           
