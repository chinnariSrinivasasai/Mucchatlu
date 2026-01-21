import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import MessageBubble from "./MessageBubble";
import { useChat } from "../store/useChat";
import { useEffect, useRef } from "react";
import { socket } from "../services/socket";




export default function ChatWindow() {
  const selectedChat = useChat((s) => s.selectedChat);
  const messages = useChat((s) => s.messages);
  const loadMessages = useChat((s) => s.loadMessages);
  const addMessage = useChat((s) => s.addMessage);
  const setTyping = useChat((s) => s.setTyping);
  const clearTyping = useChat((s) => s.clearTyping);

  const bottomRef = useRef();

  // ======================
  // 📥 Load messages when chat changes
  // ======================
  useEffect(() => {
    if (selectedChat) {
      loadMessages(selectedChat);

      // Join socket room
      socket.emit("join-chat", selectedChat._id);
    }
  }, [selectedChat]);


  useEffect(() => {
  socket.on("typing", ({ userId }) => {
    if (selectedChat) {
      setTyping(selectedChat._id, userId);

      setTimeout(() => {
        clearTyping(selectedChat._id);
      }, 1500);
    }
  });

  return () => socket.off("typing");
}, [selectedChat]);


  // ======================
  // ⚡ Receive real-time messages
  // ======================
  useEffect(() => {
    socket.on("receive-message", (msg) => {
      addMessage(msg);
    });

    return () => socket.off("receive-message");
  }, []);

  // ======================
  // 📜 Auto scroll to bottom
  // ======================
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ======================
  // 🟡 No chat selected UI
  // ======================
  if (!selectedChat) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-900 dark:text-gray-200">
        Okati Select chesi message cheyandi
      </div>
    );
  }

  // ======================
  // 🟢 Main Chat UI
  // ======================
  return (
    <div className="flex flex-col w-full h-full bg-app text-main">

      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-chat">
        {messages.map((msg) => (
          <MessageBubble key={msg._id || msg.id} {...msg} />
        ))}

        <div ref={bottomRef} />
      </div>

      <ChatInput />

    </div>
  );
}
