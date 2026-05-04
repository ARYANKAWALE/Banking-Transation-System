import express from "express"
import connectDB from "./src/db/index.js";
import env from "dotenv"

const app = express()
env.config()
connectDB()

const PORT = process.env.PORT || 3000

app.get('/',(req,res)=>{
    res.send("Server is  running") 
})

app.use(express.json())


app.listen(PORT,()=>{
    console.log(`server is running on ${PORT}` )
})