import { useEffect, useState } from "react";
import ChatItem from "./ChatItem";
import { useChat } from "../store/useChat";
import NewChatModal from "./NewChatModal";

export default function Sidebar() {
  const chats = useChat((s) => s.chats);
  const search = useChat((s) => s.search);
  const setSearch = useChat((s) => s.setSearch);
  const toggleDarkMode = useChat((s) => s.toggleDarkMode);
  const toggleProfile = useChat((s) => s.toggleProfile);
  const toggleSettings = useChat((s) => s.toggleSettings);
  const loadChats = useChat((s) => s.loadChats);

  const [showNewChat, setShowNewChat] = useState(false);

  // ======================
  // 📥 Load chats from backend on mount
  // ======================
  useEffect(() => {
    loadChats();
  }, []);

  // ======================
  // 🔍 Filter & sort chats
  // ======================
  const filtered = chats
    .filter((c) =>
      c.members?.some((m) =>
        m.name.toLowerCase().includes(search.toLowerCase())
      )
    )
    .sort((a, b) => (b.pinned || 0) - (a.pinned || 0));

  return (
    <div className="w-screen md:w-[380px] h-full border-r bg-panel text-main flex flex-col">

      {/* ================= Header ================= */}
      <div
        className="h-14 flex items-center justify-between px-4 font-bold text-lg border-b text-white dark:bg-mycolour dark:text-white"
      >
        <span className="flex" style={{ color: "#ff4e08", fontSize: "18px" }}>Mucchatlu</span>

        <div className="flex gap-3">
          <button
            onClick={toggleProfile}
            title="Profile"
            className="hover:scale-110 transition flex items-center justify-center"
              style={{ fontSize: "25px" }}
          >
            👤
          </button>

          <button
            onClick={toggleSettings}
            title="Settings"
            className="hover:scale-110 transition"
              style={{ fontSize: "25px" }}
          >
            ⚙
          </button>

          <button
            onClick={() => setShowNewChat(true)}
            title="New Chat"
            className="hover:scale-110 transition"
              style={{ fontSize: "25px" }}
          >
            ➕
          </button>

          <button
            onClick={toggleDarkMode}
            title="Toggle theme"
            className="hover:scale-110 transition"
              style={{ fontSize: "25px" }}
          >
            🌙
          </button>
        </div>
      </div>

      {/* ================= Search ================= */}
      <div className="p-2 border-b dark:border-gray-700">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 rounded bg-gray-100 dark:bg-gray-700 outline-none"
          placeholder="Search chesi vethuku..."
        />
      </div>

      {/* ================= Chat List ================= */}
      <div className="flex-1 overflow-y-auto">
        {filtered.map((chat) => (
          <ChatItem key={chat._id} chat={chat} />
        ))}

        {filtered.length === 0 && (
          <div className="text-center text-gray-400 mt-4">
            No chats found
          </div>
        )}
      </div>

      {/* ================= New Chat Modal ================= */}
      {showNewChat && <NewChatModal onClose={() => setShowNewChat(false)} />}

    </div>
  );
}
