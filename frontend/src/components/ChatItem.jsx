import { useState, useRef, useEffect } from "react";
import { useChat } from "../store/useChat";
import { useAuth } from "../store/useAuth";

export default function ChatItem({ chat }) {
  const user = useAuth((s) => s.user);
  const selectedChat = useChat((s) => s.selectedChat);
  const loadMessages = useChat((s) => s.loadMessages);
  const togglePin = useChat((s) => s.togglePin);
  const openChatMobile = useChat((s) => s.openChatMobile);
  const deleteChat = useChat((s) => s.deleteChat);

  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef();

  // ======================
  // 🧠 Find the OTHER user
  // ======================
  const otherUser = chat.members?.find((m) => m._id !== user.id);

  const isSelected = selectedChat?._id === chat._id;

  // ======================
  // Close menu on outside click
  // ======================
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div
      onClick={() => {
        loadMessages(chat);
        openChatMobile();
      }}
className={`flex items-center gap-3 p-3 cursor-pointer border-b border-gray-200 dark:border-gray-700
${
  isSelected
    ? "bg-[#E9F5F2] text-black dark:bg-gray-700 dark:text-white"
    : "hover:bg-[#E9F5F2] hover:text-black dark:hover:bg-gray-700 dark:hover:text-white"
}`}

    >
      {/* Avatar */}
      <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden" />

      {/* Name & Last Message */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <div className="font-semibold flex items-center gap-1 text-black dark:text-white truncate">
            {otherUser?.name || "User"}
            {chat.pinned && " 📌"}
          </div>
        </div>

        <div className="text-sm text-gray-900 dark:text-gray-200 truncate">
          {typeof chat.lastMessage === "string"
            ? chat.lastMessage
            : chat.lastMessage?.content || "messages emi levu"}
        </div>
      </div>

      {/* ================= 3 DOT MENU ================= */}
      <div
        ref={menuRef}
        className="relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => { setOpenMenu((o) => !o);
          }}
          className="text-xl px-2 opacity-70 hover:opacity-100"
          title="Chat options"
        >
          ⋮
        </button>

        {openMenu && (
          <div className="absolute right-0 top-full mt-2 w-40 bg-white dark:bg-gray-800 text-black dark:text-white rounded shadow-lg overflow-hidden z-50">

            {/* Pin / Unpin */}
            <div
              onClick={() => {
                togglePin(chat._id);
                setOpenMenu(false);
              }}
              className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
            >
              {chat.pinned ? "Unpin chat" : "Pin chat"}
            </div>

            {/* Delete Chat (UI only for now) */}
            <div
              onClick={() => {
                deleteChat(chat._id);
                setOpenMenu(false);
              }}
              className="px-4 py-2 hover:bg-red-100 text-red-600 cursor-pointer"
            >
              Delete chat
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
