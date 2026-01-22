import Message from "../models/Message.js";
import Chat from "../models/Chat.js";

// ===============================
// ➕ SEND MESSAGE (SECURE)
// ===============================
export const sendMessage = async (req, res) => {
  try {
    const myId = req.user._id;
    const { chatId, text } = req.body;

    const chat = await Chat.findOne({
      _id: chatId,
      members: myId
    });

    if (!chat) {
      return res.status(403).json({ message: "Not your chat" });
    }

    const msg = await Message.create({
      chat: chatId,
      sender: myId,
      type: "text",
      content: text,
      seenBy: [myId],
      deletedFor: []
    });

    chat.lastMessage = msg._id;
    await chat.save();

    const fullMsg = await msg.populate("sender", "name avatar");

    res.json(fullMsg);
  } catch (err) {
    res.status(500).json({ message: "Send failed" });
  }
};

// ===============================
// 📥 GET MESSAGES (SECURE)
// ===============================
export const getMessages = async (req, res) => {
  try {
    const myId = req.user._id;
    const chatId = req.params.chatId;

    const chat = await Chat.findOne({
      _id: chatId,
      members: myId
    });

    if (!chat) {
      return res.status(403).json({ message: "Access denied" });
    }

    const messages = await Message.find({
      chat: chatId,
      deletedFor: { $ne: myId }
    })
      .populate("sender", "name avatar")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Load failed" });
  }
};
