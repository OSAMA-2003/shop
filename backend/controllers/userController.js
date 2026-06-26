import userModel from '../models/userModel.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import validator from 'validator'
import { OAuth2Client } from 'google-auth-library'
import https from 'https'

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

const fetchGoogleUserInfo = (accessToken) => {
    return new Promise((resolve, reject) => {
        https.get(`https://www.googleapis.com/oauth2/v3/userinfo`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    try {
                        resolve(JSON.parse(data));
                    } catch (e) {
                        reject(new Error("Invalid JSON response from Google"));
                    }
                } else {
                    reject(new Error(data || `Status: ${res.statusCode}`));
                }
            });
        }).on('error', err => reject(err));
    });
};



const createToken = (id)=>{
    return jwt.sign({id},process.env.JWT_SECRET)
}


const loginUser = async(req,res)=>{
    const {email, password} = req.body

    try{
        const user = await userModel.findOne({email})
        if(!user){
            return res.status(404).json({ success:false, message: "User not found"})
        }

        const isMatch = await bcrypt.compare(password , user.password)
        if(!isMatch){
            return res.status(400).json({success:false, message: "Invalid credentials"})
        }

        const token = createToken(user._id)
        res.status(200).json({success:true, message: "Login successful", token})
    }catch(err){
        console.log(err)
        res.status(500).json({success:false, message: "Server error"})
    }
}




const registerUser = async(req,res)=>{
    const {name , email, password} = req.body

    try{
        const exist = await userModel.findOne({email})
        if(exist){
            return res.status(400).json({success:false, message: "User already exists"})
        }
        if(!validator.isEmail(email)){
            return res.status(400).json({success:false, message: "Invalid email"})
        }

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password,salt)

        const newUser = new userModel({
            name:name,
            email:email,
            password:hashPassword
        })

        const user = await newUser.save()
        const token = createToken(user._id)
        res.status(201).json({success:true, message: "User registered successfully", token})
   
    }catch(err){
        console.log(err)
        res.status(500).json({success:false, message: err.message})
    }
}

export const getUserProfile = async(req,res)=>{
    try{
        const user = await userModel.findById(req.userId).select("-password")
        if(!user){
            return res.status(404).json({success:false, message: "User not found"})
        }
        res.status(200).json({success:true, data:user})
    }catch(err){
        console.log(err)
        res.status(500).json({success:false, message: "Server error"})
    }
}



export const getAllUsers = async(req,res)=>{
    try{
        const users = await userModel.find().select("-password")
        res.status(200).json({success:true , data:users})
    }catch(err){
        console.log(err)
        res.status(500).json({success:false, message: err.message})
    }
}


export const deleteUser = async(req,res)=>{
    try{
        const {id} = req.params
        const deleteUser = await userModel.findByIdAndDelete(id)
        if(!deleteUser){
            return res.status(404).json({success:false, message: "User not found"})
         }
         res.status(200).json({success:true, message: "User deleted successfully"})
    }catch(err){
        console.log(err)
        res.status(500).json({success:false, message: err.message})
    }

}



export const makeAdmin = async(req,res)=>{
    try{
        const {id} = req.params
        const updateUser = await userModel.findByIdAndUpdate(id,{role:"admin"}, {new:true})

        if(!updateUser){
            return res.status(404).json({success:false, message: "User not found"})
        }
        res.status(200).json({success:true, message: "User made admin successfully"})
    }catch(err){
        console.log(err)
        res.status(500).json({success:false, message: err.message})
    }
}


export const makeUser = async(req,res)=>{
    try {
        const { id } = req.params;
        const user = await userModel.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        if (user.role !== "admin") {
            return res.status(400).json({ success: false, message: "User is not an admin" });
        }

        user.role = "user";
        await user.save();

        res.status(200).json({ success: true, message: "User has been successfully demoted to a regular user", user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};




const googleAuth = async (req, res) => {
    const { token, isAccessToken } = req.body

    try {
        if (!token) {
            return res.status(400).json({ success: false, message: "Token is required" })
        }

        let email, name, picture, sub;

        if (isAccessToken) {
            const data = await fetchGoogleUserInfo(token);
            email = data.email;
            name = data.name;
            picture = data.picture;
            sub = data.sub;
        } else {
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: process.env.GOOGLE_CLIENT_ID,
            })
            const payload = ticket.getPayload()
            sub = payload.sub
            email = payload.email
            name = payload.name
            picture = payload.picture
        }

        let user = await userModel.findOne({ email })

        if (user) {
            let updated = false
            if (!user.pic && picture) {
                user.pic = picture
                updated = true
            }
            if (!user.googleId) {
                user.googleId = sub
                updated = true
            }
            if (updated) {
                await user.save()
            }
        } else {
            user = new userModel({
                name,
                email,
                pic: picture || "",
                googleId: sub,
            })
            await user.save()
        }

        const jwtToken = createToken(user._id)

        res.status(200).json({
            success: true,
            message: "Login successful",
            token: jwtToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                pic: user.pic,
                role: user.role
            }
        })
    } catch (err) {
        console.error("Google Auth Error:", err)
        res.status(500).json({ success: false, message: "Google authentication failed: " + err.message })
    }
}

export {registerUser, loginUser, googleAuth}