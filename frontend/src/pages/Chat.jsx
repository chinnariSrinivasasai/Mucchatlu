import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import ProfilePanel from "../components/ProfilePanel";
import SettingsPanel from "../components/SettingsPanel";
import { useChat } from "../store/useChat";
import { socket } from "../services/socket";
import { useAuth } from "../store/useAuth";
import { useEffect } from "react";

export default function Chat() {
  const dark = useChat((s) => s.darkMode);
  const showProfile = useChat((s) => s.showProfile);
  const showSettings = useChat((s) => s.showSettings);
  const showSidebar = useChat((s) => s.showSidebar);
  const setOnlineUsers = useChat((s) => s.setOnlineUsers);
  const user = useAuth((s) => s.user);

  useEffect(() => {
    if (user) socket.emit("user-online", user.id);

    socket.on("online-users", (users) => {
      setOnlineUsers(users);
    });

    return () => socket.off("online-users");
  }, [user]);

  return (
    <div className={dark ? "dark" : ""}>
  <div className="h-screen w-screen overflow-hidden bg-app text-main">

        {/* ================= DESKTOP LAYOUT ================= */}
        <div className="hidden md:flex h-full w-full">
          <Sidebar />
          <div className="flex-1">
            <ChatWindow />
          </div>
        </div>

        {/* ================= MOBILE LAYOUT ================= */}
        <div className="md:hidden h-full w-full relative">
          {/* Sidebar */}
          <div
            className={`absolute inset-0 transition-all duration-200
              ${showSidebar ? "block" : "hidden"}
            `}
          >
            <Sidebar />
          </div>

          {/* Chat Window */}
          <div
            className={`absolute inset-0 transition-all duration-200
              ${showSidebar ? "hidden" : "block"}
            `}
          >
            <ChatWindow />
          </div>
        </div>

        {/* ================= OVERLAYS ================= */}
        {showProfile && <ProfilePanel />}
        {showSettings && <SettingsPanel />}
      </div>
    </div>
  );
}
