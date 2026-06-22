import 'dotenv/config' // Load env variables immediately before anything else
import express from 'express'
import cors from 'cors'
import connectDB from './config/db.js'
import userRouter from './routes/userRoutes.js'
import orderRouter from './routes/orderRoutes.js'
import productRouter from './routes/productRoutes.js'
import cartRouter from './routes/cartRoutes.js'
import adminRouter from './routes/adminRoutes.js'
import notificationsRouter from './routes/notificationsRoutes.js'
import mockupRouter from './routes/mockupRoutes.js'

const app = express()
const PORT = process.env.PORT || 4000
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))
app.use(cors())

app.use('/api/user',userRouter)
app.use('/api/order',orderRouter)
app.use('/api/product',productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/admin', adminRouter)
app.use('/api/notifications', notificationsRouter)
app.use('/api/mockup', mockupRouter)


app.get('/',(req,res)=>{
    res.send("API is working")
})

app.listen(PORT, async()=>{
    connectDB()
    console.log(`Server is running ${PORT}`)
})
