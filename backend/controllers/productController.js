import productModel from "../models/productModel.js";
import cloudinary from "../utils/cloudinary.js"
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
        
        // Cleanup: If database save fails, remove the newly uploaded image from Cloudinary
        if (req.file && req.file.filename) {
            try {
                await cloudinary.uploader.destroy(req.file.filename);
            } catch (cloudinaryErr) {
                console.log("Failed to clean up Cloudinary image:", cloudinaryErr);
            }
        }

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
            // Safely extract filename even if it contains multiple dots (e.g., "my.shirt.img.jpg")
            const filename = product.image.split("/").pop(); 
            const publicIdWithoutExt = filename.substring(0, filename.lastIndexOf('.')) || filename;
            
            try {
                await cloudinary.uploader.destroy(`ecommerce/${publicIdWithoutExt}`);
            } catch (cloudinaryErr) {
                console.log("Failed to delete Cloudinary image:", cloudinaryErr);
            }
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