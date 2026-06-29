import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config()


const connectDB = async () => {
    try{
        const url = process.env.MONGO_URL || "mongodb://localhost:27017/ecommerce";
        await mongoose.connect(url)
        console.log("DB Connected Successfully to " + url)
    }catch(err){
        console.error("DB Connection Failed:", err.message)
        process.exit(1)
    }
}


export default connectDB
