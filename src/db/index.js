import mongoose from "mongoose"
import { DB_NAME } from "../../utils/constants.js"


const connectDB = async () =>{
    console.log("uri check:",process.env.MONGODB_URI)
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URI, {
            dbName: DB_NAME,
        })
        console.log(`\n MongoDB Connected..! DB HOST ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log(error)
    }
}

export default connectDB
