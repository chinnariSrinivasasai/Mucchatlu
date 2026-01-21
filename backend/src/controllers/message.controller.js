import Message from "../models/Message.js";
import Chat from "../models/Chat.js";

export const sendMessage = async (req, res) => {
  try {
    const { chatId, text } = req.body;

    const msg = await Message.create({
      chat: chatId,
      sender: req.userId,
      type: "text",
      content: text,
      seenBy: [req.userId],
    });

    await Chat.findByIdAndUpdate(chatId, {
      lastMessage: msg._id,
    });

    res.json(msg);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      chat: req.params.chatId,
    })
      .populate("sender", "name avatar")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
