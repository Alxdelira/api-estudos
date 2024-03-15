import mongoose from "mongoose";

const imagemSchema = new mongoose.Schema(
  {
    tipo_arquivo: {
      type: String,
    },
    enviado_por: {
      type: mongoose.Types.ObjectId,
      ref: "usuarios",
    },
    caminho: {
      type: String,
    },
    id_imagem: {
      type: String
    }
  },
  { timestamps: { createdAt: "criado_em", updatedAt: "atualizado_em" } }
);

const ImagemModel = mongoose.model("imagens", imagemSchema);

export default ImagemModel;
