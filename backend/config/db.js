import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config()


const connectDB = async () => {
    try{
        const url = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/ecommerce";
        await mongoose.connect(url, {
            // Connection pool: keep connections ready so queries don't wait
            maxPoolSize: 10,
            // Close idle connections after 30s to free resources
            maxIdleTimeMS: 30000,
            // Fail fast if server is unreachable (10s instead of default 30s)
            serverSelectionTimeoutMS: 10000,
        })
        console.log("DB Connected Successfully to " + url)
    }catch(err){
        console.error("DB Connection Failed:", err.message)
        process.exit(1)
    }
}


export default connectDB
