import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const UsuarioSchema =  new mongoose.Schema(
  {
    nome: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    foto: {
      type: mongoose.Types.ObjectId,
      ref: "image",      
    },
    senha: {
      type: String,
      required: true,
      select: false,
    },
  });

UsuarioSchema.plugin(mongoosePaginate);

const UsuarioModel = mongoose.model("Usuario", UsuarioSchema);

export default UsuarioModel;
