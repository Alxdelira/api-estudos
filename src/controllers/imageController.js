import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import ImagemModel from '../models/image.js';

const unlinkAsync = promisify(fs.unlink);
const renameAsync = promisify(fs.rename);

class ImagensControllers {
  static async enviarImagem(req, res, next) {
    const arquivo = req.file;
    if (!arquivo) {
      return res.status(400).json({
        codigo: 400,
        mensagem: 'Arquivo inválido',
      });
    }

    const usuarioId = req.usuario && req.usuario._id;
    // if (!usuarioId) {
    //   return res.status(401).json({
    //     codigo: 401,
    //     mensagem: 'Usuário não autenticado',
    //   });
    // }

    const imagemData = {
      id_imagem: path.parse(arquivo.filename).name,
      tipo_arquivo: path.extname(arquivo.filename).slice(1),
      enviado_por: usuarioId,
      caminho: `/imagens/${arquivo.filename}`,
    };

    let imagem;
    try {
      // Cria um registro da imagem no banco de dados
      imagem = new ImagemModel(imagemData);
      await imagem.save();

      // Move o arquivo para o diretório correto após salvar o registro no banco
      const novoCaminho = path.join('imagens', arquivo.filename);
      await renameAsync(arquivo.path, novoCaminho);

      return res.status(201).json({
        codigo: 201,
        mensagem: 'Imagem enviada com sucesso',
        dados: imagem,
      });
    } catch (error) {
      console.error('Erro ao enviar imagem:', error);

      // Se ocorrer um erro, remova o arquivo se ele já foi movido
      if (imagem) {
        // Se o registro foi criado, remova o arquivo, se ele já foi movido
        const caminhoImagem = path.join('imagens', arquivo.filename);
        try {
          await unlinkAsync(caminhoImagem);
        } catch (unlinkError) {
          console.error('Erro ao remover imagem do sistema de arquivos:', unlinkError);
        }
      }

      return res.status(500).json({
        codigo: 500,
        mensagem: 'Erro interno do servidor',
      });
    }
  }

  static async mostrarImagem(req, res, next) {
    try {
      const { id } = req.params;

      const imagem = await ImagemModel.findOne({ id_imagem: id });
      if (!imagem) {
        return res.status(404).json({
          codigo: 404,
          mensagem: 'Imagem não encontrada',
        });
      }

      res.sendFile(imagem.caminho, { root: '.' });
    } catch (error) {
      console.error('Erro ao mostrar imagem:', error);
      return res.status(500).json({
        codigo: 500,
        mensagem: 'Erro interno do servidor',
      });
    }
  }

  static async deletarImagem(req, res, next) {
    try {
      const { id } = req.params;

      const imagem = await ImagemModel.findOne({ id_imagem: id });
      if (!imagem) {
        return res.status(404).json({
          codigo: 404,
          mensagem: 'Imagem não encontrada',
        });
      }

      // Remove o arquivo do sistema de arquivos
      await unlinkAsync(`imagens/${imagem.id_imagem}.${imagem.tipo_arquivo}`);
      await imagem.deleteOne();

      return res.status(200).json({
        codigo: 200,
        mensagem: 'Imagem deletada com sucesso',
      });
    } catch (error) {
      console.error('Erro ao deletar imagem:', error);
      return res.status(500).json({
        codigo: 500,
        mensagem: 'Erro interno do servidor',
      });
    }
  }

  static async listarImagens(req, res, next) {
    try {
      const imagens = await ImagemModel.find();
      if (!imagens.length) {
        return res.status(404).json({
          codigo: 404,
          mensagem: 'Nenhuma imagem encontrada',
        });
      }

      return res.status(200).json(imagens);
    } catch (error) {
      console.error('Erro ao listar imagens:', error);
      return res.status(500).json({
        codigo: 500,
        mensagem: 'Erro interno do servidor',
      });
    }
  }
}

export default ImagensControllers;
