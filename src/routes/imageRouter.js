import { Router } from "express";
import multer from "multer";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import express from "express";
import authMiddleware from "../middlewares/AuthMiddleware.js";
import ImagensControllers from "../controllers/imageController.js";

const imagensRouter = Router();

// Middleware para criar diretório de imagens se não existir
const createStorageDirectory = (req, res, next) => {
    const imagesDir = 'imagens';
    if (!fs.existsSync(imagesDir)) {
        fs.mkdirSync(imagesDir);
    }
    next();
};

// Configuração do armazenamento com multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "imagens");
    },
    filename: (req, file, cb) => {
        const fileExtension = file.mimetype.split("/")[1];
        cb(null, `${uuidv4()}.${fileExtension}`);
    },
});

// Filtro de arquivo para aceitar apenas imagens
const fileFilter = (req, file, cb) => {
    if (!/^image/.test(file.mimetype)) {
        return cb(new Error("Tipo de arquivo inválido. Envie somente imagens."), false);
    }
    cb(null, true);
};

// Configuração do middleware multer
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 10, // Limite de 10MB
    },
});

// Servir arquivos estáticos na rota /imagens
imagensRouter.use("/imagens", express.static("imagens"));

// Rotas de imagem com middleware de autenticação
imagensRouter
    .route("/imagens")
    .post(authMiddleware, createStorageDirectory, upload.single("image"), ImagensControllers.enviarImagem)
    .get(ImagensControllers.listarImagens);

imagensRouter
    .route("/imagens/:id")
    .get(authMiddleware, ImagensControllers.mostrarImagem)
    .delete(authMiddleware, ImagensControllers.deletarImagem);

export default imagensRouter;
