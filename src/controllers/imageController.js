import fs from "fs";
import ImagemModel from "../models/image.js";

class ImagensControllers {


  static async enviarImagem(req, res, next) {
    if (!req.file) {
      return res.status(400).send({
        codigo: 400,
        mensagem: "Arquivo inválido",
      });
    }

    const arquivo = req.file;
    const usuarioId = req.usuario._id.id;



    if (!usuarioId) {
      return res.status(401).send({
        codigo: 401,
        mensagem: "Usuário não autenticado",
      });
    }

    const imagem = new ImagemModel({
      id_imagem: arquivo.filename.split(".")[0],
      tipo_arquivo: arquivo.filename.split(".")[1],
      enviado_por: usuarioId, // Usa o ID do usuário em vez do objeto completo
      caminho: "/imagens/" + arquivo.filename,
    });

    try {
      await imagem.save();

      res.status(201).send({
        codigo: 201,
        mensagem: "Imagem enviada com sucesso",
        dados: imagem,
      });
    } catch (error) {
      console.error("Erro ao enviar imagem:", error);
      return res.status(500).send({
        codigo: 500,
        mensagem: "Erro interno do servidor",
      });
    }
  }
  static async mostrarImagem(req, res, next) {
    const { id } = req.params;

    const imagem = await ImagemModel.findOne({
      id_imagem: id
    });

    if (!imagem) {
      return res.status(404).send("Imagem não encontrada");
    }

    res.sendFile(imagem.caminho, { root: "." });
  }
  static async deletarImagem(req, res, next) {
    const { id } = req.params;

    const imagem = await ImagemModel.findOne({
      id_imagem: id
    });

    if (!imagem) {
      return res.status(404).send("Imagem não encontrada");
    }

    fs.unlink(
      `imagens/${imagem.id_imagem}.${imagem.tipo_arquivo}`,
      async (err) => {
        if (err) {
          console.error("Erro ao deletar imagem:", err);
          return res.status(500).send("Erro interno do servidor");
        } else {
          await imagem.deleteOne();
          res.send("Imagem deletada com sucesso");
        }
      }
    );
  }

  static async listarImagens(req, res, next) {
    try {
      const imagens = await ImagemModel.find();
      res.status(200).json(imagens);
    } catch (error) {
      res.status(500).json({ error: 500, message: 'Erro Interno no Servidor!' });
    }
  }
}

export default ImagensControllers;
