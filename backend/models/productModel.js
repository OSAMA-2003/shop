import mongoose from "mongoose";




const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    name_ar: {
        type: String,
        required: false
    },
    name_en: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: true
    },
    description_ar: {
        type: String,
        required: false
    },
    description_en: {
        type: String,
        required: false
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    sizes: {
        type: Array,
        default: ["S", "M", "L", "XL"]
    }
})


const productModel = mongoose.models.product || mongoose.model("product", productSchema)

export default productModel