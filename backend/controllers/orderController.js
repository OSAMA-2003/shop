import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import notificationsModel from "../models/notificationsModel.js";
import Stripe from "stripe";

const getStripe = () => {
    return new Stripe(process.env.STRIPE_SECRET_KEY)
}



// This API will be called by the frontend when the user places an order. It will create a new order in the database and then create a checkout session with Stripe and return the session url to the frontend to redirect the user to the Stripe checkout page

const placeOrder = async(req,res)=>{
    const frontend_url = "http://localhost:5173"
    
    try{
        // Transform address data to include all fields clearly
        const addressData = {
            firstName: req.body.address.firstName,
            lastName: req.body.address.lastName,
            email: req.body.address.email,
            street: req.body.address.street,
            city: req.body.address.city,
            state: req.body.address.state,
            zipCode: req.body.address.zipCode,
            country: req.body.address.country,
            phone: req.body.address.phone,
        }
        
        const newOrder = new orderModel({
            userId : req.userId,
            items : req.body.items,
            amount : req.body.amount,
            address : addressData,
        })

        await newOrder.save()
        await userModel.findByIdAndUpdate(req.userId,{cartData:{}}) // Use req.userId from authMiddleware
        const line_items = req.body.items.map((item)=>({
            price_data:{
                currency:"usd",
                product_data:{
                    name:item.name
                },
                unit_amount:Math.round(item.price * 100)
            },
            quantity:item.quantity
        }))

        line_items.push({
            price_data:{
                currency:"usd",
                product_data:{
                    name:"Delivery Charges"                   
                },
                unit_amount:2 * 100 // $2 delivery charge in cents
            },
            quantity:1
        })

        const session = await getStripe().checkout.sessions.create({
            line_items:line_items,
            mode:"payment",
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
        })
        res.status(200).json({success:true, message: "Order placed successfully", session_url:session.url})

    }catch(err){
        console.log(err)
        res.status(500).json({success:false, message:err.message})
    }
}


// This API will be called by the frontend after the payment is done to verify the payment and update the order status

const verifyOrder = async(req,res)=>{
    const {orderId,success} = req.body

    try{
        if(success == "true"){
            await orderModel.findByIdAndUpdate(orderId,{payment:true})

            const order = await orderModel.findById(orderId).populate('userId','name email')
            await notificationsModel.create({
                message: `The order with id ${order?._id} has been placed successfully from user ${order?.userId?.name}`,
                orderId:order._id,
                user:order?.userId?.name || "unknown"
            })



            res.status(200).json({success:true, message: "Payment successful"})
        }else{
            await orderModel.findByIdAndUpdate(orderId, {payment:false, status:"Failed"}) // Added update object
            res.status(400).json({success:false, message: "Payment failed"})
        }
    }catch(err){
        console.log(err)
        res.status(500).json({success:false, message:err.message})
    }

}


// This API will be called by the frontend to get all the orders of the logged in user

const userOrders = async(req,res)=>{
    try{
        const orders = await orderModel.find({userId:req.userId})
        console.log("Order fetched from DB:" , JSON.stringify(orders,null,2))
        res.status(200).json({success:true, data:orders})
    }catch(err){
        console.log(err)
        res.status(500).json({success:false, message:err.message}) 
    }
}


// This API will be called by the admin to get all the orders in the database

const listOrders = async(req,res)=>{
    try{
        const orders = await orderModel.find({})
        
        // Populate user information for each order
        const ordersWithUserData = await Promise.all(
            orders.map(async (order) => {
                const user = await userModel.findById(order.userId)
                return {
                    ...order.toObject(),
                    user: user ? { name: user.name, email: user.email } : { name: 'Unknown', email: 'N/A' }
                }
            })
        )
        
        res.status(200).json({success:true, data:ordersWithUserData})
    }catch(err){
        console.log(err)
        res.status(500).json({success:false, message:err.message}) 
    }
}


// This API will be called by the admin to update the status of the order

const updateStatus = async(req,res)=>{
    try{
        await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status})
        res.status(200).json({success:true, message: "status updated successfully"})
    }catch(err){
        console.log(err)
        res.status(500).json({success:false, message:err.message})
    }
}


export {placeOrder, verifyOrder, userOrders, listOrders, updateStatus}
