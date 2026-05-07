import { User as userModel } from "../models/user.models.js";
import jwt from "jsonwebtoken"

// user Register
const userRegister = async (req,res)=>{
    const { name, password, email} = req.body
    const isExists = await userModel.findOne({
        email:email
    })
    if(isExists){
        return res.status(422).json({message:"This email is already registerd",
            status:"failed"
        })
    }

    const user = await userModel.create({
        email,password,name
    })

    const token = jwt.sign({userId:user._id},process.env.JWT_SECRET,{
        expiresIn:"3d"
    })
    res.cookie("token",token)
    res.status(201).json({
        user:{
            _id:user._id,
            email:user.email,
            name:user.name,
        },
        token
    })
}

// User Login
const userLogin = async (req,res)=>{
    const {email,password} = req.body

    const user = await userModel.findOne({email}).select('+password')
    if(!user){
        return res.status(401).json({
            message:"Email or password is not valid"
        })
    }
    const isValidPassword = await user.comparePassword(password)
    if(!isValidPassword){
        return res.status(401).json({
            message:"Email or password is not valid"
        })
    }
    const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {expiresIn: "3d"})
    res.cookie("token",token)
    res.status(200).json({
        user:{
            _id:user._id,
            email:user.email,
            name:user.name
        },
        token
    })
}


export {userRegister,
    userLogin
}