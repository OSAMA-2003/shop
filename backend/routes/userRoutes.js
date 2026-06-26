import express from "express";
import { registerUser, loginUser , getAllUsers ,deleteUser , makeAdmin , makeUser, getUserProfile, googleAuth } from "../controllers/userController.js";
import authMiddleware from "../middleware/auth.js";


const userRouter = express.Router()

userRouter.post('/signup',registerUser)
userRouter.post('/login',loginUser)
userRouter.post('/google-auth', googleAuth)
userRouter.get('/users',getAllUsers)
userRouter.put('/make-admin/:id',makeAdmin)
userRouter.put('/make-user/:id',makeUser)
userRouter.delete('/delete/:id',deleteUser)
userRouter.get('/profile', authMiddleware, getUserProfile)


export default userRouter