const User = require("../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")

// Register a new user
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body

    // Check if user already exists
    let user = await User.findOne({ email })
    if (user) {
      return res.status(400).json({ message: "User already exists" })
    }

    // Create new user
    user = new User({
      name,
      email,
      password,
      role: role || "student",
    })

    // Save user to database
    await user.save()

    // Generate JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" })

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
}

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Check if user exists
    const user = await User.findOne({ email }).select("+password")
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // Check if password is correct
    const isMatch = await user.matchPassword(password)
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" })

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
}

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
}

// Logout user
exports.logout = (req, res) => {
  res.json({ message: "Logged out successfully" })
}

// Forgot password
exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex")
    user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex")
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000 // 10 minutes

    await user.save()

    // In a real application, send email with reset token
    // For now, just return the token
    res.json({ message: "Password reset token sent", resetToken })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
}

// Reset password
exports.resetPassword = async (req, res) => {
  try {
    // Get hashed token
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex")

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    })

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" })
    }

    // Set new password
    user.password = req.body.password
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined

    await user.save()

    res.json({ message: "Password reset successful" })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
}

