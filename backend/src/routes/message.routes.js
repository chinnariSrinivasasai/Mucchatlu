import express from "express";
import { protect } from "../middleware/auth.js";
import { sendMessage, getMessages } from "../controllers/message.controller.js";

const router = express.Router();

router.post("/send", protect, sendMessage);
router.get("/:chatId", protect, getMessages);

export default router;
