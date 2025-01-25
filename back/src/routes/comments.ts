import express, { Router } from 'express';
import { createComment, getPostComments, updateComment, deleteComment } from '../controllers/commentController';
import { authMiddleware } from "../middlewares/authMiddleware";

const router: Router = express.Router();

/**
 * @swagger
 * /comments/{postId}:
 *   get:
 *     summary: Get comments for a post
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *       - refreshTokenAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     responses:
 *       200:
 *         description: List of comments for the post
 *       401:
 *         description: Unauthorized
 */
router.get("/:id", authMiddleware, getPostComments);

/**
 * @swagger
 * /comments:
 *   post:
 *     summary: Create a new comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *       - refreshTokenAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - postId
 *               - content
 *             properties:
 *               postId:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Comment created successfully
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Bad request
 */
router.post("/", authMiddleware, createComment);

/**
 * @swagger
 * /comments/{id}:
 *   put:
 *     summary: Update comment by ID
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *       - refreshTokenAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Comment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Comment not found
 *       403:
 *         description: Forbidden
 */
router.put('/:id', authMiddleware, updateComment);

/**
 * @swagger
 * /comments/{id}:
 *   delete:
 *     summary: Delete comment by ID
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *       - refreshTokenAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Comment ID
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Comment not found
 *       403:
 *         description: Forbidden
 */
router.delete("/:id", authMiddleware, deleteComment);

export default router;