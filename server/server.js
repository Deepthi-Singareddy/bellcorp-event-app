

require("dotenv").config();


const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/order");



const app = express();


app.use(cors());
app.use(express.json());


const PORT = process.env.port || 5000;
const MONGODB_URI = process.env.MONGODB_URI;


console.log("Mongo URI:", MONGODB_URI);


mongoose.connect(MONGODB_URI)
.then(() => {
    console.log("✅ MongoDB connected successfully");
})
.catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
});


app.get("/", (req, res) => {
    res.send("Server is running and MongoDB connected");
});


app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);


app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
