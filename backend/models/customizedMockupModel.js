import mongoose from "mongoose";

const customizedMockupSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    mockupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "mockup",
        required: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    size: {
        type: String,
        required: true
    },
    imageFront: {
        type: String,
        required: true
    },
    imageBack: {
        type: String,
        required: true
    },
    layers: {
        type: Array,
        default: []
    },
    uploadedImages: {
        type: [String],
        default: []
    }
}, { timestamps: true });

const customizedMockupModel = mongoose.models.customizedMockup || mongoose.model("customizedMockup", customizedMockupSchema);

export default customizedMockupModel;
