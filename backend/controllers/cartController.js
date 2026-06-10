import userModel from "../models/userModel.js"


const addToCart = async (req, res) => {
    try {
        const userId = req.userId
        const { id: itemId } = req.body
        let userData = await userModel.findById(userId)
        if (!userData) {
            return res.status(404).json({ success: false, message: "user not found" })
        }
        let cartData = userData.cartData || {}

        if (!cartData[itemId]) { // Corrected: Check if item exists as a property
            cartData[itemId] = 1
        } else {
            cartData[itemId] += 1
        }
        await userModel.findByIdAndUpdate(userId, { cartData })
        res.status(200).json({ success: true, message: "Added To Cart" })
    } catch (error) {
        console.log(error) // Corrected: Log the caught error variable
        res.status(500).json({ success: false, message: error.message })

    }
}


const removeFromCart = async(req,res)=>{
    try{
        const userId = req.userId
        const {id:itemId, removeAll} = req.body // Expect removeAll flag

        const userData = await userModel.findById(userId)
        if(!userData){
            return res.status(404).json({success:false,message:"user not found"})
        }
        if(userData.cartData[itemId] > 0){
            if (removeAll) {
                delete userData.cartData[itemId];
            } else {
                userData.cartData[itemId] -= 1;
                if (userData.cartData[itemId] <= 0) delete userData.cartData[itemId];
            } 
        }
        await userData.save()
        res.status(200).json({
            success:true,
            message:"Item removed from cart",
            cartData:userData.cartData
        })


    }catch(err){
        console.log(err) // This one is fine as it catches 'err'
        res.status(500).json({success:false,message:err.message})
    }
}



const getCart = async(req,res)=>{
    try{

        const userId = req.userId
        let userData = await userModel.findById(userId)
        if(!userData){
            return res.status(404).json({success:false,message:"user not found"})
        }

        res.status(200).json({success:true,cartData:userData.cartData || {}})

    }catch(err){
        console.log(err) // This one is fine as it catches 'err'
        res.status(500).json({success:false,message:err.message})
    
    }
}


const clearCart = async(req,res)=>{
    try{

        const userId = req.userId
        const user = await userModel.findById(userId)
        if(!user){
            return res.status(404).json({success:false,message:"user not found"})

        }

        const cartData = user.cartData || {}
        user.cartData = {}
        await user.save()

        res.status(200).json({success:true,message:"Cart Cleared",cartData})

    }catch(err){
        console.log(err) // This one is fine as it catches 'err'
        res.status(500).json({success:false,message:err.message})
    
    }
}


export {addToCart,removeFromCart,getCart,clearCart}