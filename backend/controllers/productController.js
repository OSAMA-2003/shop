import productModel from "../models/productModel.js";
import fs from "fs"


const addProduct = async(req,res)=>{

    // 1. Validate image file existence
    if (!req.file) {
        return res.status(400).json({ success: false, message: "Image file is required." });
    }

    // 2. Validate required body fields
    const { name, description, price, category, color } = req.body;
    if (!name || !description || !price || !category || !color) {
        // If validation fails, delete the uploaded file to prevent orphaned files
        fs.unlink(`uploads/${req.file.filename}`, (err) => {
            if (err) console.log("Error deleting orphaned file:", err);
        });
        return res.status(400).json({ success: false, message: "All product fields are required." });
    }

    let image_filename = `${req.file.buffer.toString("base64")}`

    const product = new productModel({
        name: name,
        description: description,
        price: Number(price), // 3. Ensure price is a number
        category: category,
        image:image_filename,
        color: color,
    })

    try{
        await product.save()
        res.status(200).json({success:true, message: "Product added successfully"})
    } catch (err) {
        // If database save fails, also remove the uploaded image
        if (req.file) {
            fs.unlink(`uploads/${req.file.filename}`, (unlinkErr) => { if (unlinkErr) console.log("Error deleting file on DB save fail:", unlinkErr); });
        }
        console.log(err)
        res.status(400).json({success:false, message:err.message})
    }
}




const listProducts = async(req,res)=>{
    try{
        const products = await productModel.find({})
        res.status(200).json({success:true, data:products})
    } catch (err) {
        console.log(err)
        res.status(400).json({success:false, message:err.message})
    }
}



const removeProduct = async(req,res)=>{
    try{
        const product = await productModel.findById(req.params.id) // Use req.params.id from URL
        if (!product) {
            return res.status(404).json({success:false, message: "Product not found"})
        }

        // Delete the associated image file from the 'uploads' folder
        fs.unlink(`uploads/${product.image}`,()=>{})

        await productModel.findByIdAndDelete(req.params.id) 
        res.status(200).json({success:true, message: "Product removed successfully"})
    } catch (err) {
        console.log(err)
        res.status(400).json({success:false, message:err.message})
    }
}



export {addProduct, listProducts, removeProduct}