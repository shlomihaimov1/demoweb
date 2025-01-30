import express, { Router } from 'express';
import { authMiddleware } from "../middlewares/authMiddleware";
import multer from 'multer';

const router: Router = express.Router();
const imageUploadPath = process.env.LOCAL_IMAGE_PATH || '../front/public/images';

const storage = multer.diskStorage({
  destination: function (req: any, file: any, cb: any) {
    cb(null, imageUploadPath);
  },
  filename: function (req: any, file: any, cb: any) {
    cb(null, file.originalname);
  },
});

// Set up multer instance
const imageUpload = multer({ storage: storage });


/**
 * @swagger
 * /updateImage:
 *   post:
 *     summary: Upload an image
 *     description: Uploads an image to the server.
 *     tags:
 *       - Image
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: image
 *         type: file
 *         description: The image to upload.
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: integer
 *               example: 200
 *             message:
 *               type: string
 *               example: success
 */
router.post('/updateImage', authMiddleware, imageUpload.single("image"), (req, res) => {
  res.send({status: 200, message: "success"})
});

export default router;