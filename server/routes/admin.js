const express = require("express")
const router = express.Router()
const adminController = require("../controllers/adminController")
const { auth, isAdmin } = require("../middleware/auth")

// Admin routes
router.get("/tutors/pending", auth, isAdmin, adminController.getPendingTutors)
router.put("/tutors/:id/verify", auth, isAdmin, adminController.verifyTutor)
router.put("/tutors/:id/reject", auth, isAdmin, adminController.rejectTutor)
router.get("/reports", auth, isAdmin, adminController.getReports)
router.get("/analytics", auth, isAdmin, adminController.getAnalytics)
router.get("/users", auth, isAdmin, adminController.getAllUsers)
router.put("/users/:id/status", auth, isAdmin, adminController.updateUserStatus)

module.exports = router

