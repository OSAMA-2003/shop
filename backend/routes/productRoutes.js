import express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary.js";

import {
  addProduct,
  removeProduct,
  listProducts,
  updateProduct,
} from "../controllers/productController.js";

const productRouter = express.Router();

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "ecommerce",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const upload = multer({ storage });

productRouter.post("/add", upload.single("image"), addProduct);
productRouter.delete("/remove/:id", removeProduct);
productRouter.get("/list", listProducts);
productRouter.put("/update/:id", upload.single("image"), updateProduct);

export default productRouter;