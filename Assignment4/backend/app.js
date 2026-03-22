require("dotenv").config({ path: require("path").join(__dirname, ".env") });
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const quizRoutes = require("./routes/quizRoutes");
const questionRoutes = require("./routes/questionRoutes");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/", quizRoutes);
app.use("/", questionRoutes);
app.use("/", userRoutes);
app.use("/", authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({ message: err.message || "Internal Server Error" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});