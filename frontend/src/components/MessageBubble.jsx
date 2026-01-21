import { useState } from "react";
import { useChat } from "../store/useChat";
import { useAuth } from "../store/useAuth";

export default function MessageBubble({
  _id,
  sender,
  content,
  createdAt,
  seen,
  type = "text",
  fileUrl,
  fileName,
  deleted,
}) {
  const user = useAuth((s) => s.user);

  // ✅ Correct ownership check
  const isMe = sender?._id === user?._id;

  const [showMenu, setShowMenu] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(content || "");

  const deleteForMe = useChat((s) => s.deleteMessageForMe);
  const deleteForEveryone = useChat((s) => s.deleteMessageForEveryone);
  const editMessage = useChat((s) => s.editMessage);

  const time = createdAt
    ? new Date(createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  const handleSaveEdit = () => {
    if (!editText.trim()) return;
    editMessage(_id, editText);
    setEditing(false);
  };

  return (
    <div
      className={`w-full flex ${isMe ? "justify-end" : "justify-start"} mb-2`}
      onContextMenu={(e) => {
        e.preventDefault();
        setShowMenu(true);
      }}
    >
      {/* ================= MESSAGE BUBBLE ================= */}
      <div
        className={`
          relative
          px-3 pt-2 pb-5
          rounded-lg
          shadow
          text-sm
          whitespace-pre-wrap
          break-words
          min-w-[60px]
          max-w-[70%]
          ${
            isMe
              ? "bg-[#DCF8C6] text-black rounded-br-none"
              : "bg-white dark:bg-[#1F2C34] text-black dark:text-white rounded-bl-none"
          }
        `}
      >
        {/* Deleted */}
        {deleted && (
          <i className="opacity-70 select-none">
            This message was deleted
          </i>
        )}

        {/* Editing */}
        {!deleted && editing && (
          <div className="flex gap-2">
            <input
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="text-black text-sm p-1 rounded w-full border"
            />
            <button
              onClick={handleSaveEdit}
              className="text-xs bg-black/20 px-2 rounded"
            >
              Save
            </button>
          </div>
        )}

        {/* Normal Render */}
        {!deleted && !editing && (
          <>
            {type === "text" && (
              <div className="pr-10 leading-relaxed">
                {content}
              </div>
            )}

            {type === "image" && (
              <img
                src={fileUrl}
                className="max-w-[250px] rounded-lg"
                alt=""
              />
            )}

            {type === "video" && (
              <video
                src={fileUrl}
                controls
                className="max-w-[250px] rounded-lg"
              />
            )}

            {type === "file" && (
              <a
                href={fileUrl}
                download={fileName}
                className="flex gap-2 items-center bg-black/10 dark:bg-white/10 p-2 rounded"
              >
                📄 {fileName}
              </a>
            )}
          </>
        )}

        {/* ================= TIME + SEEN ================= */}
        <div className="absolute bottom-1 right-2 text-[10px] opacity-60 flex items-center gap-1 select-none">
          {time}
          {isMe && <span>{seen ? "✔✔" : "✔"}</span>}
        </div>
      </div>

      {/* ================= CONTEXT MENU ================= */}
      {showMenu && (
        <div
          onMouseLeave={() => setShowMenu(false)}
          className={`absolute ${
            isMe ? "right-4" : "left-4"
          } mt-10 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded shadow text-sm z-50`}
        >
          {isMe && (
            <div
              onClick={() => {
                setEditing(true);
                setShowMenu(false);
              }}
              className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
            >
              Edit
            </div>
          )}

          <div
            onClick={() => {
              deleteForMe(_id);
              setShowMenu(false);
            }}
            className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
          >
            Delete for me
          </div>

          {isMe && (
            <div
              onClick={() => {
                deleteForEveryone(_id);
                setShowMenu(false);
              }}
              className="px-3 py-2 hover:bg-red-100 text-red-600 cursor-pointer"
            >
              Delete for everyone
            </div>
          )}
        </div>
      )}
    </div>
  );
}
