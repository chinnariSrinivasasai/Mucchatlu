import { useState, useRef } from "react";
import { useChat } from "../store/useChat";
import { api } from "../services/api";
import { socket } from "../services/socket";
import { useToast } from "../store/useToast";

export default function ChatInput() {
  const [text, setText] = useState("");
  const [previewFile, setPreviewFile] = useState(null);
  const fileRef = useRef();

  const selectedChat = useChat((s) => s.selectedChat);
  const addMessage = useChat((s) => s.addMessage);
  const showToast = useToast((s) => s.showToast);

  const handleSend = async () => {
    if (!selectedChat) return;

    try {
      // ======================
      // 📎 FILE 
      // ======================
   if (previewFile) {
  showToast("File sending will be added in next update", "info");
  setPreviewFile(null);
  return;
}


      if (!text.trim()) return;

      // ======================
      // 📤 SEND TO BACKEND
      // ======================
      const res = await api.post("/messages/send", {
        chatId: selectedChat._id,
        text,
      });

      const msg = res.data;

      // ======================
      // 🧠 ADD TO LOCAL UI
      // ======================
      addMessage(msg);

      // ======================
      // ⚡ EMIT TO SOCKET
      // ======================
      socket.emit("send-message", {
        chatId: selectedChat._id,
        message: msg,
      });

      setText("");
    } catch (err) {
      console.error(err);
      showToast("Failed to send message", "error");
    }
  };

  return (
    <div className="border-t bg-white dark:bg-gray-900">

      {/* File Preview */}
      {previewFile && (
        <div className="p-3 border-b flex items-center gap-3 dark:border-gray-700">
          <div className="text-sm">
            📎 {previewFile.name}
          </div>
          <button
            onClick={() => setPreviewFile(null)}
            className="text-red-500 text-sm"
          >
            Cancel
          </button>
        </div>
      )}

      <div className="h-16 flex items-center gap-3 px-4 bg-white dark:bg-gray-800">
        <input
          ref={fileRef}
          type="file"
          hidden
          onChange={(e) => setPreviewFile(e.target.files[0])}
        />

        <button
          onClick={() => fileRef.current.click()}
          className="text-2xl bg-transparent"
        >
          📎
        </button>

        <input
          value={text}
          onChange={(e) => {
            setText(e.target.value);

            // ======================
            // ✍️ EMIT TYPING EVENT
            // ======================
            if (selectedChat) {
              socket.emit("typing", {
                chatId: selectedChat._id,
                userId: "me",
              });
            }
          }}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 p-2 border rounded-full outline-none px-4 dark:bg-gray-700 dark:text-white"
          placeholder="Type a message..."
        />

        <button
          onClick={handleSend}
          className="bg-[#0ABAB5] text-white px-4 py-2 rounded-full"
        >
          Send
        </button>
      </div>
    </div>
  );
}
