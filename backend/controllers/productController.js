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
        let sizesArray = ["S", "M", "L", "XL"];
        if (req.body.sizes) {
            try {
                sizesArray = JSON.parse(req.body.sizes);
            } catch (e) {
                if (typeof req.body.sizes === 'string') {
                    sizesArray = req.body.sizes.split(',').map(s => s.trim());
                } else {
                    sizesArray = req.body.sizes;
                }
            }
        }

        const product = new productModel({
            name,
            description,
            price: Number(price),
            category,
            image: req.file.path, // Cloudinary URL
            color,
            sizes: sizesArray,
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

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, category, color } = req.body;
        
        let updateData = {};
        if (name) updateData.name = name;
        if (description) updateData.description = description;
        if (price) updateData.price = Number(price);
        if (category) updateData.category = category;
        if (color) updateData.color = color;

        if (req.body.sizes) {
            try {
                updateData.sizes = JSON.parse(req.body.sizes);
            } catch (e) {
                if (typeof req.body.sizes === 'string') {
                    updateData.sizes = req.body.sizes.split(',').map(s => s.trim());
                } else {
                    updateData.sizes = req.body.sizes;
                }
            }
        }

        if (req.file) {
            const product = await productModel.findById(id);
            if (product && product.image) {
                const filename = product.image.split("/").pop(); 
                const publicIdWithoutExt = filename.substring(0, filename.lastIndexOf('.')) || filename;
                try {
                    await cloudinary.uploader.destroy(`ecommerce/${publicIdWithoutExt}`);
                } catch (cloudinaryErr) {
                    console.log("Failed to delete old Cloudinary image:", cloudinaryErr);
                }
            }
            updateData.image = req.file.path; // Cloudinary URL
        }

        await productModel.findByIdAndUpdate(id, updateData, { new: true });

        res.status(200).json({
            success: true,
            message: "Product updated successfully"
        });
    } catch (err) {
        console.log(err);
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

export {
    addProduct,
    listProducts,
    removeProduct,
    updateProduct
};