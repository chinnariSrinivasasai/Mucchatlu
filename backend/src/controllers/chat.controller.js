import Chat from "../models/Chat.js";
import Message from "../models/Message.js";

// ===============================
// ➕ CREATE CHAT
// ===============================
export const createChat = async (req, res) => {
  try {
    const myId = req.user._id;
    const { userId } = req.body;

    let chat = await Chat.findOne({
      members: { $all: [myId, userId] }
    });

    if (!chat) {
      chat = await Chat.create({
        members: [myId, userId],
        pinnedBy: [],
        mutedBy: []
      });
    }

    chat = await chat.populate("members", "name avatar");

    res.json(chat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Create chat failed" });
  }
};

// ===============================
// 📥 GET ONLY MY CHATS (FIXED)
// ===============================
export const getMyChats = async (req, res) => {
  try {
    const myId = req.user._id;

    const chats = await Chat.find({
      members: myId
    })
      .populate("members", "name avatar")
      .populate("lastMessage")
      .sort({ updatedAt: -1 });

    res.json(chats);
  } catch (err) {
    res.status(500).json({ message: "Load chats failed" });
  }
};

// ===============================
// 📌 PIN / UNPIN (SECURE)
// ===============================
export const togglePinChat = async (req, res) => {
  try {
    const myId = req.user._id.toString();
    const chatId = req.params.id;

    const chat = await Chat.findOne({
      _id: chatId,
      members: myId
    });

    if (!chat) return res.status(403).json({ message: "Access denied" });

    if (!chat.pinnedBy) chat.pinnedBy = [];

    const isPinned = chat.pinnedBy.some(id => id.toString() === myId);

    if (isPinned) {
      chat.pinnedBy = chat.pinnedBy.filter(id => id.toString() !== myId);
    } else {
      chat.pinnedBy.push(myId);
    }

    await chat.save();
    res.json({ pinned: !isPinned });
  } catch (err) {
    res.status(500).json({ message: "Pin failed" });
  }
};

// ===============================
// 🔕 MUTE / UNMUTE (SECURE)
// ===============================
export const toggleMuteChat = async (req, res) => {
  try {
    const myId = req.user._id.toString();
    const chatId = req.params.id;

    const chat = await Chat.findOne({
      _id: chatId,
      members: myId
    });

    if (!chat) return res.status(403).json({ message: "Access denied" });

    if (!chat.mutedBy) chat.mutedBy = [];

    const isMuted = chat.mutedBy.some(id => id.toString() === myId);

    if (isMuted) {
      chat.mutedBy = chat.mutedBy.filter(id => id.toString() !== myId);
    } else {
      chat.mutedBy.push(myId);
    }

    await chat.save();
    res.json({ muted: !isMuted });
  } catch (err) {
    res.status(500).json({ message: "Mute failed" });
  }
};

// ===============================
// 🧹 CLEAR CHAT (ONLY FOR ME)
// ===============================
export const clearChatMessages = async (req, res) => {
  try {
    const myId = req.user._id;
    const chatId = req.params.id;

    const chat = await Chat.findOne({ _id: chatId, members: myId });
    if (!chat) return res.status(403).json({ message: "Access denied" });

    await Message.updateMany(
      { chat: chatId },
      { $addToSet: { deletedFor: myId } }
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Clear failed" });
  }
};

// ===============================
// ❌ DELETE CHAT (ONLY FOR ME)
// ===============================
export const deleteChat = async (req, res) => {
  try {
    const myId = req.user._id;
    const chatId = req.params.id;

    const chat = await Chat.findOne({ _id: chatId, members: myId });
    if (!chat) return res.status(403).json({ message: "Access denied" });

    if (!chat.deletedBy) chat.deletedBy = [];
    if (!chat.deletedBy.includes(myId)) {
      chat.deletedBy.push(myId);
      await chat.save();
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
};
