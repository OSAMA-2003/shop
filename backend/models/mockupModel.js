import mongoose from "mongoose";

const mockupSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    imageFront: { type: String, required: true },
    imageBack: { type: String, required: true },
    category: { type: String, required: true },
    color: { type: String, required: true },
    sizes: { type: Array, default: ["S", "M", "L", "XL"] }
}, { timestamps: true });

const mockupModel = mongoose.models.mockup || mongoose.model("mockup", mockupSchema);

export default mockupModel;