import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import ImagemModel from '../models/image.js';
import UsuarioModel from '../models/usuario.js';

// Utiliza promisify para converter funções baseadas em callback para Promises
const unlinkAsync = promisify(fs.unlink);
const renameAsync = promisify(fs.rename);
const mkdirAsync = promisify(fs.mkdir);

// Função para obter o diretório atual
const getCurrentDir = () => path.dirname(new URL(import.meta.url).pathname);

class ImagensControllers {
  
  static async enviarImagem(req, res, next) {
    const arquivo = req.file;
    console.log(arquivo)
    if (!arquivo) {
      return res.status(400).json({
        codigo: 400,
        mensagem: 'Arquivo inválido',
      });
    }

    const usuarioId = await UsuarioModel.findById(req.usuario.id)

    const imagemData = {
      id_imagem: path.parse(arquivo.filename).name,
      tipo_arquivo: path.extname(arquivo.filename).slice(1),
      enviado_por: usuarioId,
      caminho: `/imagens/${arquivo.filename}`,
    };

    let imagem;
    console.log(imagemData)
    try {
      // Cria o diretório se não existir
      const pastaDestino = path.resolve('imagens');
      await mkdirAsync(pastaDestino, { recursive: true });

      // Cria um registro da imagem no banco de dados
      imagem = new ImagemModel(imagemData);
      await imagem.save();

      // Caminho absoluto para o destino
      const caminhoDestino = path.resolve('imagens', arquivo.filename);

      // Move o arquivo para o diretório correto após salvar o registro no banco
      await renameAsync(arquivo.path, caminhoDestino);

      // Atualiza o usuário com a imagem enviada
      await UsuarioModel.findByIdAndUpdate(usuarioId, { foto: imagem._id });

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
      // Encontre a imagem no banco de dados pelo _id
      const imagem = await ImagemModel.findById(req.params.id);
      console.log(imagem)
      if (!imagem) {
        return res.status(404).json({
          codigo: 404,
          mensagem: 'Imagem não encontrada',
        });
      }
  
      // Converta o caminho armazenado em um caminho absoluto
      const caminhoImagem = path.resolve('imagens', path.basename(imagem.caminho.split('?')[0]));
  
      console.log('Caminho da imagem:', caminhoImagem);
  
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
  
      // Encontre a imagem no banco de dados pelo _id
      const imagem = await ImagemModel.findById(id);
      if (!imagem) {
        return res.status(404).json({
          codigo: 404,
          mensagem: 'Imagem não encontrada',
        });
      }
  
      // Remove o arquivo do sistema de arquivos
      await unlinkAsync(path.resolve('imagens', path.basename(imagem.caminho.split('?')[0])));
  
      // Remove o registro da imagem no banco de dados
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
      const imagens = await ImagemModel.find().populate("enviado_por");
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
  static async atualizarImagem(req, res, next) {
    const arquivo = req.file;
    const usuarioId = req.params.id;

    console.log(arquivo)
    if (!arquivo) {
      return res.status(400).json({
        codigo: 400,
        mensagem: 'Arquivo inválido',
      });
    }

    try {
      // Encontra o usuário pelo ID
      const usuario = await UsuarioModel.findById(usuarioId);
      if (!usuario) {
        return res.status(404).json({
          codigo: 404,
          mensagem: 'Usuário não encontrado',
        });
      }

      // Se o usuário já tem uma imagem, remova-a
      if (usuario.foto) {
        const imagemAntiga = await ImagemModel.findById(usuario.foto);
        if (imagemAntiga) {
          const caminhoImagemAntiga = path.join(getCurrentDir(), '..', 'imagens', `${imagemAntiga.id_imagem}.${imagemAntiga.tipo_arquivo}`);
          if (fs.existsSync(caminhoImagemAntiga)) {
            await unlinkAsync(caminhoImagemAntiga);
          }
          await imagemAntiga.deleteOne();
        }
      }

      // Cria o diretório se não existir
      const pastaDestino = path.resolve('imagens');
      await mkdirAsync(pastaDestino, { recursive: true });

      // Cria um novo registro de imagem no banco de dados
      const imagemData = {
        id_imagem: path.parse(arquivo.filename).name,
        tipo_arquivo: path.extname(arquivo.filename).slice(1),
        enviado_por: usuarioId,
        caminho: `/imagens/${arquivo.filename}`,
      };

      const novaImagem = new ImagemModel(imagemData);
      await novaImagem.save();

      // Caminho absoluto para o destino
      const caminhoDestino = path.resolve('imagens', arquivo.filename);

      // Move o arquivo para o diretório correto
      await renameAsync(arquivo.path, caminhoDestino);

      // Atualiza o usuário com a nova imagem
      usuario.foto = novaImagem._id;
      await usuario.save();

      return res.status(200).json({
        codigo: 200,
        mensagem: 'Imagem atualizada com sucesso',
        dados: novaImagem,
      });
    } catch (error) {
      console.error('Erro ao atualizar imagem:', error);

      return res.status(500).json({
        codigo: 500,
        mensagem: 'Erro interno do servidor',
      });
    }
  }
}

export default ImagensControllers;
