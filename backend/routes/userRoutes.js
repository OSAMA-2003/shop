import express from "express";
import { registerUser, loginUser , getAllUsers ,deleteUser , makeAdmin , makeUser } from "../controllers/userController.js";



const userRouter = express.Router()

userRouter.post('/signup',registerUser)
userRouter.post('/login',loginUser)
userRouter.get('/users',getAllUsers)
userRouter.put('/make-admin/:id',makeAdmin)
userRouter.put('/make-user/:id',makeUser)
userRouter.delete('/delete/:id',deleteUser)


export default userRouter