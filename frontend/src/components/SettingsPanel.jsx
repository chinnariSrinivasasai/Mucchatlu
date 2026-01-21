import { useChat } from "../store/useChat";

export default function SettingsPanel() {
  const closePanels = useChat((s) => s.closePanels);
  const darkMode = useChat((s) => s.darkMode);
  const toggleDarkMode = useChat((s) => s.toggleDarkMode);

  return (
    <div className="fixed inset-0 z-[999] bg-black/40 flex justify-end">
      {/* Panel */}
      <div className="w-screen md:w-[320px] h-full bg-white dark:bg-gray-900 flex flex-col">

        {/* Header */}
        <div className="h-14 flex items-center justify-between px-4 font-bold border-b dark:border-gray-700">
          <span>Settings</span>
          <button onClick={closePanels}>✖</button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">

          <div className="flex items-center justify-between">
            <span>Dark Mode</span>
            <button
              onClick={toggleDarkMode}
              className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded"
            >
              {darkMode ? "ON" : "OFF"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
