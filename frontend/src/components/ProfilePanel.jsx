import { useState } from "react";
import { useChat } from "../store/useChat";

export default function ProfilePanel() {
  const userProfile = useChat((s) => s.userProfile);
  const updateAvatar = useChat((s) => s.updateAvatar);
  const updateProfile = useChat((s) => s.updateProfile);
  const closePanels = useChat((s) => s.closePanels);

  const [name, setName] = useState(userProfile.name);
  const [about, setAbout] = useState(userProfile.about);

  const handleSave = () => {
    updateProfile({ name, about });
    closePanels();
  };

  return (
    <div className="fixed inset-0 z-[999] bg-black/40 flex justify-end">
      {/* Panel */}
      <div className="w-screen md:w-[320px] h-full bg-white dark:bg-gray-900 flex flex-col">

        {/* Header */}
        <div className="h-14 flex items-center justify-between px-4 font-bold border-b dark:border-gray-700">
          <span>Profile</span>
          <button onClick={closePanels}>✖</button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 overflow-y-auto">

          {/* Avatar */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-24 h-24 rounded-full bg-gray-300 overflow-hidden">
              {userProfile.avatar && (
                <img
                  src={userProfile.avatar}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            <label className="cursor-pointer text-sm text-blue-500">
              Change Photo
              <input
                type="file"
                hidden
                onChange={(e) => updateAvatar(e.target.files[0])}
              />
            </label>
          </div>

          {/* Name */}
          <div>
            <label className="text-sm text-gray-500">Your name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded dark:bg-gray-800"
            />
          </div>

          {/* About */}
          <div>
            <label className="text-sm text-gray-500">About</label>
            <textarea
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              className="w-full p-2 border rounded resize-none dark:bg-gray-800"
              rows={3}
            />
          </div>

          {/* Save */}
          <button
            onClick={handleSave}
            className="w-full bg-[#0ABAB5] text-white p-2 rounded"
          >
            Save Changes
          </button>

        </div>
      </div>
    </div>
  );
}
