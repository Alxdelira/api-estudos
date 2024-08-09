import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import ImagemModel from '../models/image.js';

// Utiliza o promissify para funções baseadas em callback
const unlinkAsync = promisify(fs.unlink);
const renameAsync = promisify(fs.rename);

// Função para obter o diretório atual
const getCurrentDir = () => path.dirname(new URL(import.meta.url).pathname);

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
  
      // Caminho absoluto para o destino
      const caminhoDestino = path.resolve('imagens', arquivo.filename);
  
      // Move o arquivo para o diretório correto após salvar o registro no banco
      await renameAsync(arquivo.path, caminhoDestino);
  
      return res.status(201).json({
        codigo: 201,
        mensagem: 'Imagem enviada com sucesso',
        dados: imagem,
      });
    } catch (error) {
      console.error('Erro ao enviar imagem:', error);
  
      // Se ocorrer um erro, remova o arquivo se ele já foi movido
      if (imagem) {
        const caminhoImagem = path.resolve('imagens', arquivo.filename);
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

      // Encontre a imagem no banco de dados pelo ID
      const imagem = await ImagemModel.findOne({ id_imagem: id });
      if (!imagem) {
        return res.status(404).json({
          codigo: 404,
          mensagem: 'Imagem não encontrada',
        });
      }

      // Converta o caminho armazenado em um caminho absoluto
      // Supondo que imagem.caminho é um caminho relativo a partir da raiz do projeto
      const caminhoImagem = path.resolve('imagens', path.basename(imagem.caminho));

      // Verifique se o arquivo realmente existe antes de tentar enviá-lo
      if (fs.existsSync(caminhoImagem)) {
        res.sendFile(caminhoImagem);
      } else {
        return res.status(404).json({
          codigo: 404,
          mensagem: 'Imagem não encontrada no sistema de arquivos',
        });
      }
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
      await unlinkAsync(path.join(getCurrentDir(), '..', 'imagens', `${imagem.id_imagem}.${imagem.tipo_arquivo}`));
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
