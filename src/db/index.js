import mongoose from "mongoose"
import { DB_NAME } from "../../utils/constants.js"
import { User } from "../models/user.models.js"


const connectDB = async () =>{
    console.log("uri check:",process.env.MONGODB_URI)
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URI, {
            dbName: DB_NAME,
        })
        console.log(`\n MongoDB Connected..! DB HOST ${connectionInstance.connection.host}`)
        await User.syncIndexes()
        console.log("User indexes synced with schema (removed stale indexes if any)")
    } catch (error) {
        console.error("MongoDB connection error:", error)
        throw error
    }
}

export default connectDB
