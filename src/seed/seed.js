import mongoose from 'mongoose';
import UsuarioModel from '../models/usuario.js';
import bcrypt from 'bcrypt';
import faker from 'faker';
import * as dotenv from 'dotenv';

dotenv.config();

const SALT_ROUNDS = 8;
const NUM_USERS = 100; // Número total de usuários a serem criados

// Dados do usuário padrão
const standardUser = {
  nome: 'Alexandre Nogueira',
  email: 'alx.delira@gmail.com',
  senha: '12345678',
  foto: null, // Pode adicionar URL de imagem se necessário
};

const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Conexão estabelecida com sucesso!');
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
    process.exit(1);
  }
};

const seedUsers = async () => {
  try {
    // Limpar a coleção antes de popular
    await UsuarioModel.deleteMany({});

    // Criptografar a senha do usuário padrão
    const senhaHash = await bcrypt.hash(standardUser.senha, SALT_ROUNDS);

    // Criar o usuário padrão
    await UsuarioModel.create({
      ...standardUser,
      senha: senhaHash,
    });

    // Criar usuários adicionais
    for (let i = 0; i < NUM_USERS - 1; i++) {
      const nome = faker.name.findName();
      const email = faker.internet.email();
      const senha = faker.internet.password();

      // Criptografar a senha
      const senhaHash = await bcrypt.hash(senha, SALT_ROUNDS);

      await UsuarioModel.create({
        nome,
        email,
        senha: senhaHash,
        foto: null, // Pode adicionar URL de imagem se necessário
      });
    }

    console.log('Usuários criados com sucesso.');
    process.exit(0);
  } catch (error) {
    console.error('Erro ao executar o seed de usuários:', error);
    process.exit(1);
  }
};

// Conectar ao banco de dados e depois executar o seed
const runSeed = async () => {
  await connectToDatabase();
  await seedUsers();
};

runSeed();
