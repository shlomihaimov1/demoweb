import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { getMessages, getUsersForSidebar, sendMessage } from "../controllers/messageController";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Messages
 *   description: API for managing messages
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: User ID
 *         username:
 *           type: string
 *           description: Username
 *         email:
 *           type: string
 *           description: User email
 *         profilePicture:
 *           type: string
 *           description: Profile picture URL
 *         city:
 *           type: string
 *           description: City
 *         country:
 *           type: string
 *           description: Country
 *         month:
 *           type: string
 *           description: Birth month
 *         year:
 *           type: string
 *           description: Birth year
 *     Message:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Message ID
 *         senderId:
 *           type: string
 *           description: Sender user ID
 *         receiverId:
 *           type: string
 *           description: Receiver user ID
 *         text:
 *           type: string
 *           description: Message text
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Message creation time
 */

/**
 * @swagger
 * /messages/users:
 *   get:
 *     summary: Get users for sidebar
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal server error
 */
router.get("/users", authMiddleware, getUsersForSidebar);

/**
 * @swagger
 * /messages/get/{id}:
 *   get:
 *     summary: Get messages between users
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID to get messages with
 *     responses:
 *       200:
 *         description: List of messages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Message'
 *       400:
 *         description: Invalid user ID
 *       500:
 *         description: Internal server error
 */
router.get("/get/:id", authMiddleware, getMessages);

/**
 * @swagger
 * /messages/send/{id}:
 *   post:
 *     summary: Send a message
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Receiver user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 description: Message text
 *     responses:
 *       201:
 *         description: Message sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       400:
 *         description: Invalid user ID
 *       500:
 *         description: Internal server error
 */
router.post("/send/:id", authMiddleware, sendMessage);

export default router;
