const jwt = require("jsonwebtoken")
const User = require("../models/User")

// Authenticate user
exports.auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header("x-auth-token")

    // Check if no token
    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" })
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Add user from payload
    req.user = decoded

    next()
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" })
  }
}

// Check if user is admin
exports.isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" })
    }

    next()
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
}

// Check if user is tutor
exports.isTutor = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    if (user.role !== "tutor") {
      return res.status(403).json({ message: "Access denied" })
    }

    next()
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
}

// Check if user is student
exports.isStudent = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    if (user.role !== "student") {
      return res.status(403).json({ message: "Access denied" })
    }

    next()
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
}

