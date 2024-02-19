import express from "express";
import ImagemController from "../controllers/imageController.js";
import upload from "../config/multer.js";
import authMiddleware from "../middlewares/AuthMiddleware.js";

const router = express.Router();

router
    .post("/images/uploads",authMiddleware, upload.single("file"), ImagemController.uploadImage)
    .get("/images", ImagemController.findAllImage)
    .delete("/images/remover/:id", ImagemController.removeImage)

export default router
