import express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary.js";
import { placeOrder , verifyOrder , userOrders ,listOrders, updateStatus, updatePaymentStatus } from "../controllers/orderController.js";
import authMiddleware from "../middleware/auth.js";

const orderRouter = express.Router()

// Multer storage configuration for payment screenshots
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "ecommerce/payments",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const upload = multer({ storage });

orderRouter.post('/place', authMiddleware , upload.single('paymentScreenshot'), placeOrder)
orderRouter.post('/verify',authMiddleware ,verifyOrder) // Changed to POST to accept body from frontend
orderRouter.post('/userorders',authMiddleware ,userOrders)

orderRouter.post('/list', listOrders) // Added POST and removed user auth for admin access
orderRouter.get('/list', listOrders)  // Kept GET as fallback, removed user auth
orderRouter.post('/status', updateStatus) // Removed user auth for admin access
orderRouter.post('/payment-status', updatePaymentStatus) // Manually verify payment in admin

export default orderRouter