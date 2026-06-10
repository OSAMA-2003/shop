import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";



export const adminLogin = async(req,res)=>{
    try{
        const {email,password} = req.body
        const user = await userModel.findOne({email})
        if(!user) return res.status(400).json({message:"User not found"})
        if(user.role !== 'admin') return res.status(400).json({message:"You are not an admin"})

        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch) return res.status(400).json({message:"Invalid password"})
        
        const token = jwt.sign(
            {id:user._id, role:user.role},
            process.env.JWT_SECRET,
            {expiresIn:"1d"}
        )
        
        res.status(200).json({ success:true, token, user: {name:user.name,email:user.email} })
    }catch(err){
        console.log(err)
        res.status(500).json({message:err.message})
    

    }
}