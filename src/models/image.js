import mongoose from "mongoose";


const ImageSchema = new mongoose.Schema(
    {
        nome: { type: String },
        src: {
            type: String,
            required: true,
        },
    })
const image = mongoose.model("image", ImageSchema);
export default image;