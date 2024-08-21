import mongoose from "mongoose";

// Definição do esquema para o modelo de Imagem
const imagemSchema = new mongoose.Schema(
  {
    tipo_arquivo: {
      type: String,
      required: true, // Adiciona validação para garantir que o tipo de arquivo seja fornecido
      enum: ['jpeg', 'png', 'bmp', 'webp', 'jpg'], // Enum para restringir os tipos de arquivo permitidos
    },
    enviado_por: {
      type: mongoose.Types.ObjectId,
      ref: "Usuario",
    },
    caminho: {
      type: String,
    },
    id_imagem: {
      type: String,
      unique: true, // Garante que o id_imagem seja único
    }
  },
  {
    timestamps: { createdAt: "criado_em", updatedAt: "atualizado_em" },
    versionKey: false // Remove o campo __v que é adicionado por padrão pelo Mongoose
  }
);

const ImagemModel = mongoose.model("Imagem", imagemSchema);

export default ImagemModel;
