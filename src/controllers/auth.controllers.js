import { User as userModel } from "../models/user.models.js";
import jwt from "jsonwebtoken"


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

export {userRegister,
    
}