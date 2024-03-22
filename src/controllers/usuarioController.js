import UsuarioModel from '../models/usuario.js';
import bcrypt from 'bcrypt';

export default class UsuarioController {
  static async criarUsuario(req, res) {
    try {
      const { nome, email, senha, foto } = req.body;

      // Verifica se todos os campos obrigatórios foram fornecidos
      if (!nome || !email || !senha) {
        return res.status(400).json({ error: 400, message: 'Dados obrigatórios faltando!' });
      }

      // Verifica se o usuário já está cadastrado pelo email
      const usuarioExiste = await UsuarioModel.findOne({ email });
      if (usuarioExiste) {
        return res.status(400).json({ error: 400, message: 'Usuário já cadastrado!' });
      }

      // Hash da senha antes de salvar no banco de dados
      const senhaHash = await bcrypt.hash(senha, 8);

      // Cria um novo usuário com os dados fornecidos
      const novoUsuario = await UsuarioModel.create({
        nome,
        email,
        senha: senhaHash,
        foto
      });

      res.status(201).json({ message: 'Novo usuário cadastrado com sucesso!', novoUsuario });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 500, message: 'Erro interno no servidor' });
    }
  }

  static async listar(req, res) {
    try {
      const { nome, email, page = 1, perPage = 10 } = req.query;

      // Opções para a consulta paginada
      const options = {
        page: parseInt(page),
        limit: parseInt(perPage) > 10 ? 10 : parseInt(perPage)
      };

      // Pesquisa de usuários com base nos parâmetros fornecidos
      const pesquisa = {
        nome: { $regex: nome || '', $options: 'i' },
        email: { $regex: email || '', $options: 'i' }
      };

      // Consulta paginada de usuários
      const usuarios = await UsuarioModel.paginate(pesquisa, options);

      if (!usuarios.docs.length) {
        return res.status(404).json({ error: 404, message: 'Nenhum usuário encontrado!' });
      }

      res.status(200).json(usuarios);
    } catch (error) {
      res.status(500).json({ error: 500, message: 'Erro interno no servidor!' });
    }
  }

  static async listarPorId(req, res) {
    try {
      const usuario = await UsuarioModel.findById(req.params.id);

      if (!usuario) {
        return res.status(404).json({ error: 404, message: 'Usuário não encontrado!' });
      }

      res.status(200).json(usuario);
    } catch (error) {
      res.status(500).json({ error: 500, message: 'Erro interno no servidor!' });
    }
  }

  static async alterarUsuario(req, res) {
    try {
      const { nome, email, senha } = req.body;

      // Busca o usuário pelo ID
      const usuario = await UsuarioModel.findById(req.params.id);

      if (!usuario) {
        return res.status(404).json({ error: 404, message: 'Usuário não encontrado!' });
      }

      // Atualiza os campos do usuário com os novos valores, se fornecidos
      usuario.nome = nome || usuario.nome;
      usuario.email = email || usuario.email;
      
      if (senha) {
        const senhaHash = await bcrypt.hash(senha, 8);
        usuario.senha = senhaHash;
      }

      // Salva as alterações no banco de dados
      await usuario.save();

      res.status(200).json({ message: 'Usuário alterado com sucesso!', usuario });
    } catch (error) {
      res.status(500).json({ error: 500, message: 'Erro interno no servidor!' });
    }
  }

  static async deletarUsuario(req, res) {
    try {
      // Busca o usuário pelo ID e o deleta
      const usuario = await UsuarioModel.findByIdAndDelete(req.params.id);

      if (!usuario) {
        return res.status(404).json({ error: 404, message: 'Usuário não encontrado!' });
      }

      res.status(200).json({ message: 'Usuário deletado com sucesso!', usuario });
    } catch (error) {
      res.status(500).json({ error: 500, message: 'Erro interno no servidor!' });
    }
  }
}
