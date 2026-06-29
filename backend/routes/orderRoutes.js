import express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary.js";
import { placeOrder, verifyOrder, userOrders, listOrders, updateStatus, updatePaymentStatus } from "../controllers/orderController.js";
import authMiddleware from "../middleware/auth.js";
import path from "path";
import fs from "fs";

const orderRouter = express.Router()

// Ensure uploads folder exists for local fallback
const uploadsDir = "./uploads";
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer storage configuration with disk fallback if Cloudinary is not configured
let storage;
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "ecommerce/payments",
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
    },
  });
} else {
  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
  });
}

const upload = multer({ storage });

orderRouter.post('/place', authMiddleware, upload.single('paymentScreenshot'), placeOrder)
orderRouter.post('/verify', authMiddleware, verifyOrder) // Changed to POST to accept body from frontend
orderRouter.post('/userorders', authMiddleware, userOrders)

orderRouter.post('/list', listOrders) // Added POST and removed user auth for admin access
orderRouter.get('/list', listOrders)  // Kept GET as fallback, removed user auth
orderRouter.post('/status', updateStatus) // Removed user auth for admin access
orderRouter.post('/payment-status', updatePaymentStatus) // Manually verify payment in admin

export default orderRouter