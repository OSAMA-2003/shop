import notificationsModel from "../models/notificationsModel.js";
import orderModel from "../models/orderModel.js";


export const getAllNotifications = async(req,res)=>{
    try{
        const notification = await notificationsModel.find().sort({createdAt:-1})
        res.status(200).json({success:true, data:notification})
    }catch(err){       
        console.log(err)
        res.status(500).json({success:false, message:err.message})
    }
}


export const deleteNotification = async(req,res)=>{
    try{
        const {id} = req.params
        await notificationsModel.findByIdAndDelete(id)
        res.status(200).json({success:true, message:"Notification deleted successfully"})
    }catch(err){
        console.log(err)
        res.status(500).json({success:false, message:err.message})
        
    }
}


export const clearAllNotifications = async(req,res)=>{
    try{
        await notificationsModel.deleteMany({})
        res.status(200).json({success:true, message:"All notifications cleared successfully"})
    }catch(err){
        console.log(err)
        res.status(500).json({success:false, message:err.message})
   
    }
}



export const markAsRead = async(req,res)=>{
    try{
        const {id} = req.params
        await notificationsModel.findByIdAndUpdate(id,{isRead:true})
        res.status(200).json({success:true, message:"Notification marked as read successfully"})
    }catch(err){
        console.log(err)
        res.status(500).json({success:false, message:err.message})
    }
}
   


export const creatNotificationForOrder = async(orderData)=>{
    try{
        const {userId , _id} = orderData
        await notificationsModel.create({
            message:` You have new order ${_id} `,
            orderId:_id,
            user:userId || 'unknown'
        })
    }catch(err){
        console.log("Error in creatNotificationForOrder:", err);
    }
}
        
