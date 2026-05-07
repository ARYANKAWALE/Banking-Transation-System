import mongoose, { Types } from "mongoose"
import bcrypt from "bcryptjs"

const UserSchema = new mongoose.Schema({
    email:{
        require:[true,"Email is required for creating a user"],
        type:String,
        trim:true,
        lowercase:true,
        match:[/^[^@]+@[^@]+\.[^@]+$/, "Invalid email address"],
        unique:[true, "Email already exist."]
    },
    name:{
        type:String,
        required:[true,"Name is required for creating an account"]
    },
    password:{
        type:String,
        required:[true,"Password is required for creating an account"],
        minlength:[6,"Password must contain more than 6 characters"],
        select:false
    }


},{timestamps:true})

UserSchema.pre("save",async function(){
    if(!this.isModified("password")){
        return
    }
    const hash = await bcrypt.hash(this.password,10)
    this.password = hash
    return
})

UserSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password, this.password)
}

export const User = mongoose.model("User",UserSchema)