const express = require("express")
const router = express.Router()
const tutorController = require("../controllers/tutorController")
const authMiddleware = require("../middleware/authMiddleware")
const upload = require("../middleware/upload") // This now gets the middleware directly

// Public routes
router.get("/", tutorController.getAllTutors)
router.get("/featured", tutorController.getFeaturedTutors)
router.get("/search", tutorController.searchTutors)
router.get("/:id", tutorController.getTutorById)
router.get("/:id/reviews", tutorController.getTutorReviews)
router.get("/:id/availability", tutorController.getTutorAvailability)

// Protected routes
// Change the order of routes to avoid "profile" being treated as an ID
router.get("/me", authMiddleware, tutorController.getTutorProfile) // Changed from /profile to /me
router.post("/", authMiddleware, upload.single("profilePicture"), tutorController.createTutorProfile)
router.put("/", authMiddleware, upload.single("profilePicture"), tutorController.updateTutorProfile)
router.put("/availability", authMiddleware, tutorController.updateTutorAvailability)

module.exports = router
