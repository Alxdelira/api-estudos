import { Router } from "express";
import multer from "multer";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";
import ImagensControllers from "../controllers/imageController.js";
import express from "express";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import authMiddleware from "../middlewares/AuthMiddleware.js";

const imagensRouter = Router();

const createStorage = (req, res, next) => {
    if (!fs.existsSync('imagens')) {
        fs.mkdirSync('imagens');
    }
    next()
}

const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, "imagens");
    },
    filename: (req, file, cb) => {
        cb(null, uuidv4() + "." + file.mimetype.split("/")[1]);
    },
});

const fileFilter = (req, file, cb) => {
    const errors = [];

    if (!/^image/.test(file.mimetype))
        errors.push("Tipo de arquivo inválido, envie somente imagens");

    if (errors.length > 0) return cb(null, false);

    cb(null, true);
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 10,
    },
});

imagensRouter.use("/imagens", express.static("imagens"));
imagensRouter
    .route("/imagens")
    .post(authMiddleware, createStorage, upload.single("image"), ImagensControllers.enviarImagem);

imagensRouter
    .route("/imagens/:id")
    .delete(AuthMiddleware, ImagensControllers.deletarImagem);

imagensRouter
    .route("/imagens/:id")
    .get(ImagensControllers.mostrarImagem);

export default imagensRouter;

