import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

// Função para conectar ao banco de dados MongoDB
async function connectToDatabase() {
    const dbUrl = process.env.DB_URL;
    
    if (!dbUrl) {
        throw new Error("A URL do banco de dados não está definida no ambiente.");
    }

    try {
        await mongoose.connect(dbUrl); 
        console.log("Conectado ao MongoDB com sucesso.");
    } catch (error) {
        console.error("Erro ao conectar ao MongoDB:", error);
        throw new Error("Não foi possível conectar ao banco de dados.");
    }
}

// Conecta ao banco de dados ao iniciar o aplicativo
connectToDatabase();

const db = mongoose.connection;

// Exporta a conexão do banco de dados para uso em outros módulos
export default db;
