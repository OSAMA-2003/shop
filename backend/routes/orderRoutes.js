import express from "express";
import { placeOrder , verifyOrder , userOrders ,listOrders, updateStatus } from "../controllers/orderController.js";
import authMiddleware from "../middleware/auth.js";


const orderRouter = express.Router()


orderRouter.post('/place', authMiddleware ,placeOrder)
orderRouter.post('/verify',authMiddleware ,verifyOrder) // Changed to POST to accept body from frontend
orderRouter.post('/userorders',authMiddleware ,userOrders)

orderRouter.post('/list', listOrders) // Added POST and removed user auth for admin access
orderRouter.get('/list', listOrders)  // Kept GET as fallback, removed user auth
orderRouter.post('/status', updateStatus) // Removed user auth for admin access



export default orderRouter