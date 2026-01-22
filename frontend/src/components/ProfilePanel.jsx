import { useChat } from "../store/useChat";
import { useAuth } from "../store/useAuth";

export default function ProfilePanel() {
  const closePanels = useChat((s) => s.closePanels);
  const user = useAuth((s) => s.user);
  const logout = useAuth((s) => s.logout);

  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center">
      <div className="w-[90%] max-w-md bg-white dark:bg-gray-800 rounded-lg p-6 relative">

        {/* Close */}
        <button
          onClick={closePanels}
          className="absolute top-2 right-3 text-xl"
        >
          ✖
        </button>

        {/* Profile Info */}
        <div className="flex flex-col items-center gap-4">

          <div className="w-24 h-24 rounded-full bg-gray-300 overflow-hidden">
            {user.avatar && (
              <img src={user.avatar} className="w-full h-full object-cover" />
            )}
          </div>

          <div className="text-center">
            <div className="text-xl font-bold">
              {user.name}
            </div>
            <div className="text-sm text-gray-500">
              {user.email}
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="mt-6 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
          >
            🚪 Logout
          </button>

        </div>
      </div>
    </div>
  );
}
