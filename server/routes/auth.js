const express = require("express")
const router = express.Router()
const authController = require("../controllers/authController")
const { validateRegistration, validateLogin } = require("../middleware/validation")

// Auth routes
router.post("/register", validateRegistration, authController.register)
router.post("/login", validateLogin, authController.login)
router.get("/me", authController.getCurrentUser)
router.post("/logout", authController.logout)
router.post("/forgot-password", authController.forgotPassword)
router.post("/reset-password/:token", authController.resetPassword)

module.exports = router

