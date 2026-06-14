import productModel from "../models/productModel.js";


const addProduct = async(req,res)=>{

    // 1. Validate image file existence
    if (!req.file) {
        return res.status(400).json({ success: false, message: "Image file is required." });
    }

    // 2. Validate required body fields
    const { name, description, price, category, color } = req.body;
    if (!name || !description || !price || !category || !color) {
        return res.status(400).json({ success: false, message: "All product fields are required." });
    }

    // Convert the image buffer to a Base64 string to store directly in the database
    const imageBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

    const product = new productModel({
        name: name,
        description: description,
        price: Number(price), // 3. Ensure price is a number
        category: category,
        image: imageBase64, // Store Base64 string in DB
        color: color,
    })

    try{
        await product.save()
        res.status(200).json({success:true, message: "Product added successfully"})
    } catch (err) {
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

        await productModel.findByIdAndDelete(req.params.id) 
        res.status(200).json({success:true, message: "Product removed successfully"})
    } catch (err) {
        console.log(err)
        res.status(400).json({success:false, message:err.message})
    }
}



export {addProduct, listProducts, removeProduct}