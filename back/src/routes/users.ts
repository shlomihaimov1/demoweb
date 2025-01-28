import express, { Router } from 'express';
import { getAllUsers, getUserById, deleteUser, updateUser } from '../controllers/usersController';
import { authMiddleware } from "../middlewares/authMiddleware";
import multer from 'multer';

const router: Router = express.Router();
const imageUploadPath = '../front/public/images';

const storage = multer.diskStorage({
  destination: function (req: any, file: any, cb: any) {
    cb(null, imageUploadPath);
  },
  filename: function (req: any, file: any, cb: any) {
    cb(null, `${req.body.profilePicture}`);
  },
});

// Set up multer instance
const imageUpload = multer({ storage: storage });

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *       - refreshTokenAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *       401:
 *         description: Unauthorized
 */
router.get('/', authMiddleware, getAllUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *       - refreshTokenAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.get('/:id', authMiddleware, getUserById);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *       - refreshTokenAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.delete('/:id', authMiddleware, deleteUser);

/**
 * @swagger
 * /users/update/{id}:
 *   post:
 *     summary: Update post by ID
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *       - refreshTokenAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               username:
 *                 type: string
 *               profilePicture:
 *                 type: string
 *     responses:
 *       200:
 *         description: Post updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Post not found
 *       403:
 *         description: Forbidden
 */
router.post('/update', authMiddleware, updateUser);
router.post('/updateImage', authMiddleware, imageUpload.single("profile-pic"), (req, res) => {res.send({status: 200, message: "success"})});

export default router;
