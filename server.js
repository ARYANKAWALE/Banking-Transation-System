import "dotenv/config";
import connectDB from "./src/db/index.js";
import app from "./src/app.js";

app.get("/", (req, res) => {
  res.send("Server is  running");
});

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`server is running on ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  }
};

start();
