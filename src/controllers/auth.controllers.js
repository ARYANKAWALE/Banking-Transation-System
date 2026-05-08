import { User as userModel } from "../models/user.models.js";
import jwt from "jsonwebtoken"
import emailService from "../services/email.services.js"

// user Register
const userRegister = async (req,res)=>{
    try {
        const { name, password, email} = req.body

        if(!name || !email || !password){
            return res.status(400).json({ message: "Name, email, and password are required", status: "failed" })
        }

        const isExists = await userModel.findOne({ email })
        if(isExists){
            return res.status(422).json({ message: "This email is already registered", status: "failed" })
        }

        const user = await userModel.create({ email, password, name })

        const secret = process.env.JWT_SECRET
        if (!secret) {
            console.error("Register error: JWT_SECRET is not set")
            return res.status(500).json({ message: "Server configuration error", status: "failed" })
        }

        const token = jwt.sign({ userId: user._id }, secret, { expiresIn: "3d" })
        res.cookie("token", token, { httpOnly: true })

        return res.status(201).json({
            message: "Registration successful",
            user: {
                _id: user._id,
                email: user.email,
                name: user.name,
            },
            token
        })
    } catch (error) {
        console.error("Register error:", error)
        return res.status(500).json({ message: "Internal server error", status: "failed" })
    }
}

// User Login
const userLogin = async (req,res)=>{
    try {
        const { email, password } = req.body

        if(!email || !password){
            return res.status(400).json({ message: "Email and password are required", status: "failed" })
        }

        const user = await userModel.findOne({ email }).select('+password')
        if(!user){
            return res.status(401).json({ message: "Email or password is not valid" })
        }

        const isValidPassword = await user.comparePassword(password)
        if(!isValidPassword){
            return res.status(401).json({ message: "Email or password is not valid" })
        }

        const secret = process.env.JWT_SECRET
        if (!secret) {
            console.error("Login error: JWT_SECRET is not set")
            return res.status(500).json({ message: "Server configuration error", status: "failed" })
        }

        const token = jwt.sign({ userId: user._id }, secret, { expiresIn: "3d" })
        res.cookie("token", token, { httpOnly: true })

        // Send email asynchronously (don't await — don't block the response)
        emailService.sendRegistrationEmail(user.email, user.name).catch(err =>
            console.error("Email send failed:", err)
        )

        return res.status(200).json({
            message: "Login successful",
            user: {
                _id: user._id,
                email: user.email,
                name: user.name
            },
            token
        })
    } catch (error) {
        console.error("Login error:", error)
        return res.status(500).json({ message: "Internal server error", status: "failed" })
    }
}


export {userRegister,
    userLogin
}