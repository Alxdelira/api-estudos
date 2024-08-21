import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

// Definição do esquema para o modelo de Usuário
const UsuarioSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: true, // Garante que o nome seja fornecido
      trim: true, // Remove espaços em branco extras
    },
    email: {
      type: String,
      required: true, // Garante que o email seja fornecido
      unique: true, // Garante que o email seja único
      trim: true, // Remove espaços em branco extras
      lowercase: true, // Converte o email para minúsculas
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'O email deve ser válido'], // Valida o formato do email
    },
    foto: { type: mongoose.Schema.Types.ObjectId, ref: 'Imagem' },
    senha: {
      type: String,
      required: true, // Garante que a senha seja fornecida
      select: false, // Não inclui a senha nas consultas por padrão
    },
  },
  {
    timestamps: { createdAt: "criado_em", updatedAt: "atualizado_em" }, // Adiciona timestamps de criação e atualização
    versionKey: false, // Remove o campo __v
  }
);

UsuarioSchema.plugin(mongoosePaginate);

const UsuarioModel = mongoose.model("Usuario", UsuarioSchema);

export default UsuarioModel;
