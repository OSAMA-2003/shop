import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    items: {
        type: Array,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    address: {
        type: Object,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "on the way", "delivered"],
        default: "pending"
    },
    date: {
        type: String,
        default: () => new Date().toISOString()
    },
    payment: {
        type: Boolean,
        default: false
    },
    paymentScreenshot: {
        type: String,
        default: ""
    }
})

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema)

export default orderModel;
