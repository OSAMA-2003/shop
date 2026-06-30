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
app.use('/uploads', express.static('uploads'))

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

// Health check endpoint for keep-alive pings
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: Date.now() })
})

app.listen(PORT, async()=>{
    await connectDB()
    console.log(`Server is running ${PORT}`)

    // Keep-alive: ping ourselves every 14 minutes to prevent Render free tier from sleeping
    // Render spins down free services after 15 min of inactivity
    const KEEP_ALIVE_INTERVAL = 14 * 60 * 1000 // 14 minutes
    const RENDER_URL = process.env.RENDER_EXTERNAL_URL || process.env.FRONTEND_URL?.replace('shop-test-amber.vercel.app', 'shop-2-ms77.onrender.com') || `http://localhost:${PORT}`
    const BACKEND_URL = process.env.BACKEND_URL || 'https://shop-2-ms77.onrender.com'

    setInterval(async () => {
        try {
            const response = await fetch(`${BACKEND_URL}/api/health`)
            console.log(`[Keep-Alive] Ping sent at ${new Date().toISOString()} - Status: ${response.status}`)
        } catch (err) {
            console.error(`[Keep-Alive] Ping failed:`, err.message)
        }
    }, KEEP_ALIVE_INTERVAL)
})
