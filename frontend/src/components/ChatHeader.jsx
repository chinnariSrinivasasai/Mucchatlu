import { useChat } from "../store/useChat";
import { useAuth } from "../store/useAuth";
import { useState, useRef, useEffect } from "react";


export default function ChatHeader() {
  const selectedChat = useChat((s) => s.selectedChat);
  const onlineUsers = useChat((s) => s.onlineUsers);
  const openSidebarMobile = useChat((s) => s.openSidebarMobile);
  const closeChat = useChat((s) => s.closeChat);


  const togglePin = useChat((s) => s.togglePin);
  const toggleMute = useChat((s) => s.toggleMute);
  const clearChat = useChat((s) => s.clearChat);

  const user = useAuth((s) => s.user);

  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef();

  if (!selectedChat) return null;

  // 🧠 Find other user
  const otherUser = selectedChat.members?.find(
    (m) => m._id !== user.id
  );

  const isOnline = onlineUsers.includes(otherUser?._id);

  // ======================
  // 🧼 Close menu on outside click
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
    <div className="h-14 border-b flex items-center justify-between px-4 bg-panel text-white">

      {/* ================= LEFT ================= */}
      <div className="flex items-center gap-3">
        {/* Back button (mobile) */}
        <button
          onClick={openSidebarMobile}
          className="md:hidden mr-1 text-xl"
        >
          ⬅
        </button>

        {/* Avatar */}
        <div className="relative w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
          {otherUser?.avatar && (
            <img
              src={otherUser.avatar}
              className="w-full h-full object-cover"
            />
          )}

          {isOnline && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
          )}
        </div>

        {/* Name + Status */}
        <div>
          <div className="font-semibold color-main dark:text-white">
            {otherUser?.name || "User"}
            {selectedChat.pinned && " 📌"}
            {selectedChat.muted && " 🔕"}
          </div>
          <div className="text-xs">
            {isOnline ? "online" : "offline"}
          </div>
        </div>
      </div>

      {/* ================= RIGHT ================= */}
      <div className="relative" ref={menuRef}>
        {/* 3 DOT BUTTON */}
        <button
          onClick={() => setOpenMenu((s) => !s)}
          className="text-2xl px-2"
          title="Chat options"
        >
          ⋮
        </button>

        {/* ================= MENU ================= */}
        {openMenu && (
          <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 text-black dark:text-white rounded shadow-lg overflow-hidden z-50">

            {/* Pin */}
            <div
              onClick={() => {
                togglePin(selectedChat._id);
                setOpenMenu(false);
              }}
              className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
            >
              {selectedChat.pinned ? "Unpin chat" : "Pin chat"}
            </div>

            {/* Mute */}
            <div
              onClick={() => {
                toggleMute(selectedChat._id);
                setOpenMenu(false);
              }}
              className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
            >
              {selectedChat.muted ? "Unmute" : "Mute (Silent)"}
            </div>
            {/* Clear Messages */}
         <div onClick={() => {
    if (confirm("Clear all messages in this chat?")) {
      clearChat(selectedChat._id);
    }
    setOpenMenu(false);
  }}
  className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
>
  Clear messages
</div>
<div
  onClick={() => {
    closeChat();
    setOpenMenu(false);
  }}
  className="px-4 py-2 hover:bg-red-100 text-red-600 cursor-pointer"
>
  Close chat
</div>


          </div>
        )}
      </div>
    </div>
  );
}
