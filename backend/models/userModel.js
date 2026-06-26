import mongoose from "mongoose";




const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{ 
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:false
    },
    pic:{
        type:String,
        default:""
    },
    googleId:{
        type:String,
        unique:true,
        sparse:true
    },
    cartData:{
        type:Object,
        default:{}
    },
    role:{
        type:String, 
        enum:['user', 'admin'],  
        default:'user'
    }
    
},{minimize:false})


const userModel = mongoose.models.user || mongoose.model("user",userSchema)

export default userModel