import connectDB from "./src/db/index.js";
import env from "dotenv";
import app from "./src/app.js";

env.config();
connectDB();

app.get("/", (req, res) => {
    res.send("Server is  running");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`);
});
