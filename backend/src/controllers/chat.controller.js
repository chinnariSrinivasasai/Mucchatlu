import Chat from "../models/Chat.js";
import Message from "../models/Message.js";

// ===============================
// 📌 PIN / UNPIN CHAT
// ===============================
export const togglePinChat = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const chatId = req.params.id;

    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ message: "Chat not found" });

    if (!chat.pinnedBy) chat.pinnedBy = [];

    const isPinned = chat.pinnedBy.some((id) => id.toString() === userId);

    if (isPinned) {
      chat.pinnedBy = chat.pinnedBy.filter((id) => id.toString() !== userId);
    } else {
      chat.pinnedBy.push(userId);
    }

    await chat.save();

    res.json({ pinned: !isPinned });
  } catch (err) {
    console.error("Pin error:", err);
    res.status(500).json({ message: "Server error" });
  }
};  

// ===============================
// 🔕 MUTE / UNMUTE CHAT
// ===============================
export const toggleMuteChat = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const chatId = req.params.id;

    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ message: "Chat not found" });

    if (!chat.mutedBy) chat.mutedBy = [];

    const isMuted = chat.mutedBy.some((id) => id.toString() === userId);

    if (isMuted) {
      chat.mutedBy = chat.mutedBy.filter((id) => id.toString() !== userId);
    } else {
      chat.mutedBy.push(userId);
    }

    await chat.save();

    res.json({ muted: !isMuted });
  } catch (err) {
    console.error("Mute error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ===============================
// 🧹 CLEAR ALL MESSAGES IN CHAT
// ===============================
export const clearChatMessages = async (req, res) => {
  try {
    const chatId = req.params.id;

    await Message.deleteMany({ chat: chatId });

    await Chat.findByIdAndUpdate(chatId, {
      lastMessage: null,
    });

    res.json({ message: "Chat cleared" });
  } catch (err) {
    console.error("Clear chat error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ===============================
// 🗑 DELETE CHAT (AND MESSAGES)
// ===============================
export const deleteChat = async (req, res) => {
  try {
    const chatId = req.params.id;

    // delete messages
    await Message.deleteMany({ chat: chatId });

    // delete chat
    await Chat.findByIdAndDelete(chatId);

    res.json({ message: "Chat deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


export const createChat = async (req, res) => {
  try {
    const { userId } = req.body;

    let chat = await Chat.findOne({
      members: { $all: [req.userId, userId] },
    });

    if (!chat) {
      chat = await Chat.create({
        members: [req.userId, userId],
      });
    }

    res.json(chat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMyChats = async (req, res) => {
  try {
    const chats = await Chat.find({
      members: req.userId,
    })
      .populate("members", "name avatar")
      .populate("lastMessage")
      .sort({ updatedAt: -1 });

    res.json(chats);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
