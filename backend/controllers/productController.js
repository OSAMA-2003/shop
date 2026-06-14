import productModel from "../models/productModel.js";
import cloudinary from "../config/cloudinary.js";

const addProduct = async (req, res) => {

    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: "Image file is required."
        });
    }

    const { name, description, price, category, color } = req.body;

    if (!name || !description || !price || !category || !color) {
        return res.status(400).json({
            success: false,
            message: "All product fields are required."
        });
    }

    try {

        const product = new productModel({
            name,
            description,
            price: Number(price),
            category,
            image: req.file.path, // Cloudinary URL
            color,
        });

        await product.save();

        res.status(200).json({
            success: true,
            message: "Product added successfully"
        });

    } catch (err) {
        console.log(err);

        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};



const listProducts = async (req, res) => {
    try {

        const products = await productModel.find({});

        res.status(200).json({
            success: true,
            data: products
        });

    } catch (err) {
        console.log(err);

        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};



const removeProduct = async (req, res) => {

    try {

        const product = await productModel.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // حذف الصورة من Cloudinary
        if (product.image) {

            const publicId = product.image
                .split("/")
                .pop()
                .split(".")[0];

            await cloudinary.uploader.destroy(
                `ecommerce/${publicId}`
            );
        }

        await productModel.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Product removed successfully"
        });

    } catch (err) {

        console.log(err);

        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};

export {
    addProduct,
    listProducts,
    removeProduct
};