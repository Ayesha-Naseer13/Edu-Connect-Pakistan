const express = require("express")
const router = express.Router()
const wishlistController = require("../controllers/wishlistController")
const { auth } = require("../middleware/auth")

// Wishlist routes
router.get("/", auth, wishlistController.getWishlist)
router.post("/:tutorId", auth, wishlistController.addToWishlist)
router.delete("/:tutorId", auth, wishlistController.removeFromWishlist)

module.exports = router

