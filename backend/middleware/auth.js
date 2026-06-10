import jwt from "jsonwebtoken"


const authMiddleware = async(req,res,next)=>{
    const {token} = req.headers

    if(!token){
        return res.status(401).json({success:false , message:"Not Authorized. Login First"})
    }

    try{
        const token_decode = jwt.verify(token,process.env.JWT_SECRET)
        req.userId = token_decode.id
        next()
    }catch(err){
        console.log(err)
        return res.status(401).json({success:false , message:"Invalid Token"})
    
    }
}


export default authMiddleware