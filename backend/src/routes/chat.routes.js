import express from "express";
import { protect } from "../middleware/auth.js";
import { togglePinChat,
         deleteChat, 
         createChat, 
         getMyChats,
         toggleMuteChat, 
         clearChatMessages } from "../controllers/chat.controller.js";

const router = express.Router();

router.post("/create", protect, createChat);
router.get("/", protect, getMyChats);
router.patch("/:id/pin", protect, togglePinChat);
router.patch("/:id/mute", protect, toggleMuteChat);
router.delete("/:id/clear", protect, clearChatMessages);
router.delete("/:id", protect, deleteChat);

export default router;




