import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config()


const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log("DB Connected Successfully")
    }catch(err){
        console.error("DB Connection Failed", err.message)
        process.exit(1)
    }
}


export default connectDB
