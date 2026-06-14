import express from "express";
import multer from "multer";
import fs from "fs";
import { addProduct , removeProduct , listProducts } from "../controllers/productController.js";

const productRouter = express.Router()

// Automatically create the 'uploads' folder so the server doesn't crash
const dir = './uploads';
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
}

// THIS IS THE FIX: Use diskStorage instead of memoryStorage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); 
    },
    filename: function (req, file, cb) {
        // Creates a unique string for the file, e.g., 1718363728_shirt.jpg
        cb(null, `${Date.now()}_${file.originalname}`); 
    }
});

const upload = multer({storage:storage})

productRouter.post('/add', upload.single('image'), addProduct)
productRouter.delete('/remove/:id', removeProduct)
productRouter.get('/list', listProducts)

export default productRouter