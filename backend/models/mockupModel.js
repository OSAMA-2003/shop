import mongoose from "mongoose";

const mockupSchema = new mongoose.Schema({
    name: { type: String, required: true },
    name_ar: { type: String, required: false },
    name_en: { type: String, required: false },
    description: { type: String, required: true },
    description_ar: { type: String, required: false },
    description_en: { type: String, required: false },
    price: { type: Number, required: true },
    imageFront: { type: String, required: true },
    imageBack: { type: String, required: true },
    sizes: { type: Array, default: ["S", "M", "L", "XL"] }
}, { timestamps: true });

const mockupModel = mongoose.models.mockup || mongoose.model("mockup", mockupSchema);

export default mockupModel;