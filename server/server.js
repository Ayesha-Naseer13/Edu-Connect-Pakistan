const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv")
const path = require("path")
const multer = require("multer")
const { v4: uuidv4 } = require("uuid")

// Load environment variables
dotenv.config()

// Initialize Express app
const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/")
  },
  filename: (req, file, cb) => {
    const uniqueFilename = `${uuidv4()}-${file.originalname}`
    cb(null, uniqueFilename)
  },
})

const upload = multer({ storage })

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err))

// Import routes
const authRoutes = require("./routes/auth")
const tutorRoutes = require("./routes/tutors")
const sessionRoutes = require("./routes/sessions")
const wishlistRoutes = require("./routes/wishlist")
const reviewRoutes = require("./routes/reviews")
const adminRoutes = require("./routes/admin")

// Use routes
app.use("/api/auth", authRoutes)
app.use("/api/tutors", tutorRoutes)
app.use("/api/sessions", sessionRoutes)
app.use("/api/wishlist", wishlistRoutes)
app.use("/api/reviews", reviewRoutes)
app.use("/api/admin", adminRoutes)

// Serve uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../build")))

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../build", "index.html"))
  })
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: "Something went wrong!" })
})

// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

