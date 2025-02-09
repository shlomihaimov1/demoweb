import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { getMessages, getUsersForSidebar, sendMessage } from "../controllers/messageController";

const router = express.Router();

router.get("/users", authMiddleware, getUsersForSidebar);
router.get("/:id", authMiddleware, getMessages);

router.post("/send/:id", authMiddleware, sendMessage);

export default router;
