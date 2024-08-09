import UsuarioModel from '../models/usuario.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const secret = process.env.SECRET;

export default class LoginController {
  static async login(req, res) {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        return res.status(400).json({ message: 'Credenciais inválidas. Verifique seu email e senha e tente novamente.' });
      }

      // Adiciona o populate na propriedade foto
      const usuario = await UsuarioModel.findOne({ email }).select('+senha').populate('foto');

      if (!usuario) {
        return res.status(404).json({ message: 'Usuário não encontrado. Verifique se o email está correto ou registre-se para criar uma conta.' });
      }

      const isPasswordValid = await bcrypt.compare(senha, usuario.senha);
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Credenciais inválidas. Verifique seu email e senha e tente novamente.' });
      }

      if (!secret) {
        return res.status(500).json({ message: 'Ocorreu um erro interno no servidor. Por favor, tente novamente mais tarde.' });
      }

      const token = jwt.sign({ id: usuario._id }, secret, { expiresIn: '1h' });

      return res.status(200).json({
        token,
        usuario: {
          nome: usuario.nome,
          email: usuario.email,
          foto: usuario.foto, // Agora 'foto' estará populada com os dados completos
        },
      });
    } catch (error) {
      console.error('Erro no login:', error);
      return res.status(500).json({ message: 'Ocorreu um erro interno no servidor. Por favor, tente novamente mais tarde.' });
    }
  }
}

