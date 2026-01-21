import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useChat } from "../store/useChat";

export default function NewChatModal({ onClose }) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const loadChats = useChat((s) => s.loadChats);

  useEffect(() => {
    if (!q.trim()) {
      setResults([]);
      return;
    }

    const search = async () => {
      const res = await api.get("/users/search?q=" + q);
      setResults(res.data);
    };

    search();
  }, [q]);

  const startChat = async (userId) => {
    await api.post("/chats/create", { userId });
    await loadChats();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 w-[360px] rounded-xl shadow-xl">

        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center">
          <span className="font-semibold">New Chat</span>
          <button onClick={onClose}>✖</button>
        </div>

        {/* Search */}
        <div className="p-3">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search users..."
            className="w-full p-2 border rounded dark:bg-gray-800"
          />
        </div>

        {/* Results */}
        <div className="max-h-[300px] overflow-y-auto">
          {results.map((u) => (
            <div
              key={u._id}
              onClick={() => startChat(u._id)}
              className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden" />
              <div>{u.name}</div>
            </div>
          ))}

          {q && results.length === 0 && (
            <div className="text-center text-gray-400 p-4">
              No users found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
