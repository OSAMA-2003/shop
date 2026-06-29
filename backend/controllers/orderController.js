import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import notificationsModel from "../models/notificationsModel.js";
import Stripe from "stripe";

const getStripe = () => {
    return new Stripe(process.env.STRIPE_SECRET_KEY)
}



// This API will be called by the frontend when the user places an order. It will create a new order in the database and then create a checkout session with Stripe and return the session url to the frontend to redirect the user to the Stripe checkout page

const placeOrder = async(req,res)=>{
    try{
        let addressData;
        try {
            addressData = typeof req.body.address === 'string' ? JSON.parse(req.body.address) : req.body.address;
        } catch (e) {
            addressData = req.body.address;
        }

        let itemsData;
        try {
            itemsData = typeof req.body.items === 'string' ? JSON.parse(req.body.items) : req.body.items;
        } catch (e) {
            itemsData = req.body.items;
        }

        const addressMapped = {
            firstName: addressData?.firstName || "",
            lastName: addressData?.lastName || "",
            email: addressData?.email || "",
            street: addressData?.street || "",
            city: addressData?.city || "",
            state: addressData?.state || "",
            zipCode: addressData?.zipCode || "",
            country: addressData?.country || "",
            phone: addressData?.phone || "",
        }

        let paymentScreenshotUrl = "";
        if (req.file) {
            paymentScreenshotUrl = req.file.path.replace(/\\/g, '/'); // URL from CloudinaryStorage or normalized local path
        }

        const newOrder = new orderModel({
            userId : req.userId,
            items : itemsData,
            amount : Number(req.body.amount),
            address : addressMapped,
            paymentScreenshot: paymentScreenshotUrl,
            payment: false, // Initially false, admin verifies manually
            date: new Date().toISOString()
        })

        await newOrder.save()

        // Clear user cart now that order is placed with receipt
        await userModel.findByIdAndUpdate(req.userId, { cartData: {} });

        // Retrieve user name for notification
        const user = await userModel.findById(req.userId);
        const username = user ? user.name : "Customer";

        await notificationsModel.create({
            message: `A new order with id ${newOrder._id} has been placed. Waiting for payment approval from user ${username}`,
            orderId: newOrder._id,
            user: username
        })

        res.status(200).json({success:true, message: "Order placed successfully. Payment receipt uploaded.", orderId: newOrder._id})

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
            // Update and get the order in one go
            const order = await orderModel.findByIdAndUpdate(orderId, { payment: true }, { new: true }).populate('userId', 'name email');
            
            if (!order) {
                return res.status(404).json({ success: false, message: "Order not found" });
            }

            // Clear user cart now that payment is confirmed
            await userModel.findByIdAndUpdate(order.userId._id || order.userId, { cartData: {} });

            await notificationsModel.create({
                message: `The order with id ${order._id} has been placed successfully from user ${order.userId?.name || 'Customer'}`,
                orderId:order._id,
                user:order.userId?.name || "unknown"
            })

            res.status(200).json({success:true, message: "Payment successful"})
        }else{
            await orderModel.findByIdAndUpdate(orderId, { payment: false, status: "Failed" });
            res.status(200).json({ success: false, message: "Payment failed or cancelled" });
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
        // Use populate to get user data in a single query for better performance
        const orders = await orderModel.find({}).populate({
            path: 'userId',
            select: 'name email'
        });

        res.status(200).json({success:true, data:orders})
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

// This API will be called by the admin to update the payment status of the order (Mark as Paid/Unpaid)
const updatePaymentStatus = async(req,res)=>{
    const { orderId, payment } = req.body;
    try {
        const order = await orderModel.findByIdAndUpdate(orderId, { payment: payment }, { new: true }).populate('userId', 'name email');
        
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        // Add a notification for payment verification update
        await notificationsModel.create({
            message: `Payment status for order ${order._id} has been updated to ${payment ? 'Paid' : 'Unpaid'} by Admin.`,
            orderId: order._id,
            user: order.userId?.name || "unknown"
        });

        res.status(200).json({ success: true, message: `Order payment marked as ${payment ? 'Paid' : 'Unpaid'} successfully`, data: order });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: err.message });
    }
}


export {placeOrder, verifyOrder, userOrders, listOrders, updateStatus, updatePaymentStatus}
