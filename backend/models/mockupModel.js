import mongoose from "mongoose";

const mockupSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    color: { type: String, required: true }
}, { timestamps: true });

const mockupModel = mongoose.models.mockup || mongoose.model("mockup", mockupSchema);

export default mockupModel;