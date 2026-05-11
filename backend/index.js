const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

dotenv.config();

const authrouter = require("./routes/authrouter");
const uploadroutes = require("./routes/uploadrouter");
const historyroutes = require("./routes/historyroutes");
const userroutes = require("./routes/userroutes");
const institutionroutes = require("./routes/institutionroutes");
const settingsroutes = require("./routes/settingsroutes");
const supportroutes = require("./routes/supportroutes");
const profileroutes = require("./routes/profileroutes");
const app = express();
const questionPaperRoutes = require("./routes/questionpaperroutes");
const answerCheckRoutes = require("./routes/answercheckroutes");
const studentAnswerRoutes =require("./routes/studetanswerroute");


// Middlewares
app.use(cors({
  origin: "*"
}));
app.use(express.json());

// Serve uploaded files BEFORE routes
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Routes
app.use("/auth", authrouter);
app.use("/upload", uploadroutes);
app.use("/history", historyroutes);
app.use("/users",userroutes);
app.use("/institutions",institutionroutes);
app.use("/settings", settingsroutes);
app.use("/support",supportroutes);
app.use("/profile",profileroutes)
app.use( "/api/question-paper",questionPaperRoutes);
app.use("/api/answers",answerCheckRoutes);
app.use("/api/student",studentAnswerRoutes);

// Mongo + Server Start
const PORT = process.env.PORT || 8080;

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () =>
      console.log(`🚀 Server running: http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));
