const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const productRoutes = require("./routes/productRoutes");
const path = require("path");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const maxUploadSize = process.env.MAX_UPLOAD_SIZE || '10mb';
app.use(cors({
  origin: [process.env.FRONTEND_URL , process.env.BACKEND_URL, process.env.DEPLOY_URL, process.env.FRONTEND_URL_WEBSITE, process.env.MAIN_WEBSITE, process.env.MAIN_WEBSITE2],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

mongoose.connect(process.env.MONGO_DB_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use(express.json({ limit: maxUploadSize }));
app.use(express.urlencoded({ extended: true, limit: maxUploadSize }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/products", productRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to Naaree Collection Backend");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));