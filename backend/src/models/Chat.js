import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
     pinnedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
     mutedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
     deletedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export default mongoose.model("Chat", chatSchema);
