import express from "express";
import multer from "multer";
import { addProduct , removeProduct , listProducts } from "../controllers/productController.js";

const productRouter = express.Router()

// Use memoryStorage so the file buffer is available to be converted to Base64
const storage = multer.memoryStorage();

const upload = multer({storage:storage})

productRouter.post('/add', upload.single('image'), addProduct)
productRouter.delete('/remove/:id', removeProduct)
productRouter.get('/list', listProducts)

export default productRouter