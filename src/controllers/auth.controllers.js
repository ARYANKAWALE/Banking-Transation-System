import userModel from "../models/user.models.js";
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
}

export {userRegister,
    
}