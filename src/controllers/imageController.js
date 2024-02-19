import Image from "../models/image.js";
import fs from "fs";

export default class ImagemController {
    static uploadImage = async (req, res) => {
        try {
          const { nome } = req.body;
          const file = req.file;
    
          const image = new Image({
            nome,
            src: file.path,
          });

          if(!file){
            return res.status(400).json({ error: true, code: 400, message: "Arquivo não enviado!" });
          }
    
          await image.save();
          res.status(200).json({ image, message: "Imagem salva com sucesso!" });
        } catch (error) {
          console.log(error);
          return res
            .status(500)
            .json({ error: true, code: 500, message: "Erro interno no servidor" });
        }
    
    }


    static findAllImage = async (req, res) => {
        try {
            const image = await Image.find();
            res.json(image);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: true, code: 500, message: "Erro interno no servidor" });
        }
    }


    static removeImage = async (req, res) => {
        try {
            const { id } = req.params;

            // Busca o documento de imagem pelo ID
            const image = await Image.findById(id);

            // Verifica se a imagem foi encontrada
            if (!image) {
                return res.status(404).json({ error: true, code: 404, message: "Imagem não encontrada!" });
            }

            // Remove o documento de imagem do banco de dados
            await image.deleteOne();

            // Remove o arquivo físico da imagem do sistema de arquivos
            fs.unlinkSync(image.src);

            res.status(200).json({ message: "Imagem removida com Sucesso!" });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: true, code: 500, message: "Erro interno no servidor" });
        }
    };

}
