import express from "express";
import { addToCart, removeFromCart, getCart, clearCart } from "../controllers/cartController.js";
import authMiddleware from "../middleware/auth.js";

const cartRouter = express.Router();

cartRouter.post('/add', authMiddleware, addToCart);
cartRouter.post('/remove', authMiddleware, removeFromCart);
cartRouter.post('/clear', authMiddleware, clearCart);
cartRouter.get('/get', authMiddleware, getCart); // This is the missing route


export default cartRouter;