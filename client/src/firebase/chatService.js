import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  doc,
  setDoc,
} from "firebase/firestore";

import { db } from "./firebase";

/*
 * Creates the same room id no matter who starts the chat.
 */
export function getRoomId(user1, user2) {
  return [user1, user2]
    .sort((a, b) => a - b)
    .join("_");
}

/*
 * Send a new message
 */
export async function sendMessage(senderId, receiverId, text) {
  const roomId = getRoomId(senderId, receiverId);

  // Save the message
  await addDoc(
    collection(db, "chats", roomId, "messages"),
    {
      senderId,
      receiverId,
      text,
      createdAt: serverTimestamp(),
      seen: false,
    }
  );

  // Update the chat document
  await setDoc(
    doc(db, "chats", roomId),
    {
      participants: [senderId, receiverId],
      lastMessage: text,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

/*
 * Listen for messages in real time
 */
export function subscribeToMessages(senderId, receiverId, callback) {
  const roomId = getRoomId(senderId, receiverId);

  const q = query(
    collection(db, "chats", roomId, "messages"),
    orderBy("createdAt", "asc")
  );

  return onSnapshot(
  q,
  (snapshot) => {
    const messages = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    callback(messages);
  },
  (error) => {
    console.error("Firestore listener error:", error);
  }
);
}
export function subscribeToChats(callback) {
  const q = query(
    collection(db, "chats"),
    orderBy("updatedAt", "desc")
  );

  return onSnapshot(q, (snapshot) => {
    const chats = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    callback(chats);
  });
}