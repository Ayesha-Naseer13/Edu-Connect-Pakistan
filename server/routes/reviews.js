const express = require("express")
const router = express.Router()
const reviewController = require("../controllers/reviewController")
const { auth } = require("../middleware/auth")
const { validateReview } = require("../middleware/validation")

// Review routes
router.post("/:tutorId", auth, validateReview, reviewController.createReview)
router.get("/tutor/:tutorId", reviewController.getTutorReviews)
router.put("/:id", auth, validateReview, reviewController.updateReview)
router.delete("/:id", auth, reviewController.deleteReview)

module.exports = router

