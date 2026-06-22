import userModel from "../models/userModel.js"

const addToCart = async (req, res) => {
    try {
        const userId = req.userId
        const { id: itemId, size = 'M', quantity = 1 } = req.body
        const cartKey = itemId.includes('_') ? itemId : `${itemId}_${size}`

        let userData = await userModel.findById(userId)
        if (!userData) {
            return res.status(404).json({ success: false, message: "user not found" })
        }
        let cartData = userData.cartData || {}

        if (!cartData[cartKey]) {
            cartData[cartKey] = quantity
        } else {
            cartData[cartKey] += quantity
        }
        
        userData.cartData = cartData
        userData.markModified('cartData')
        await userData.save()
        
        res.status(200).json({ success: true, message: "Added To Cart", cartData: userData.cartData })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message })
    }
}

const removeFromCart = async (req, res) => {
    try {
        const userId = req.userId
        const { id: itemId, size = 'M', removeAll } = req.body
        const cartKey = itemId.includes('_') ? itemId : `${itemId}_${size}`

        const userData = await userModel.findById(userId)
        if (!userData) {
            return res.status(404).json({ success: false, message: "user not found" })
        }
        let cartData = userData.cartData || {}
        if (cartData[cartKey] > 0) {
            if (removeAll === true || removeAll === 'true') {
                delete cartData[cartKey];
            } else {
                cartData[cartKey] -= 1;
                if (cartData[cartKey] <= 0) delete cartData[cartKey];
            }
        }
        
        userData.cartData = cartData
        userData.markModified('cartData')
        await userData.save()
        
        res.status(200).json({
            success: true,
            message: "Item removed from cart",
            cartData: userData.cartData
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({ success: false, message: err.message })
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