const Wishlist = require("../models/Wishlist")
const Tutor = require("../models/Tutor")

// Get user's wishlist
exports.getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ student: req.user.id }).populate({
      path: "tutors",
      populate: {
        path: "user",
        select: "name email",
      },
    })

    if (!wishlist) {
      wishlist = new Wishlist({
        student: req.user.id,
        tutors: [],
      })

      await wishlist.save()
    }

    res.json(wishlist)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
}

// Add tutor to wishlist
exports.addToWishlist = async (req, res) => {
  try {
    // Check if tutor exists
    const tutor = await Tutor.findById(req.params.tutorId)
    if (!tutor) {
      return res.status(404).json({ message: "Tutor not found" })
    }

    // Find or create wishlist
    let wishlist = await Wishlist.findOne({ student: req.user.id })

    if (!wishlist) {
      wishlist = new Wishlist({
        student: req.user.id,
        tutors: [req.params.tutorId],
      })
    } else {
      // Check if tutor is already in wishlist
      if (wishlist.tutors.includes(req.params.tutorId)) {
        return res.status(400).json({ message: "Tutor already in wishlist" })
      }

      wishlist.tutors.push(req.params.tutorId)
    }

    await wishlist.save()

    res.json(wishlist)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
}

// Remove tutor from wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    // Find wishlist
    const wishlist = await Wishlist.findOne({ student: req.user.id })

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" })
    }

    // Check if tutor is in wishlist
    const index = wishlist.tutors.indexOf(req.params.tutorId)
    if (index === -1) {
      return res.status(400).json({ message: "Tutor not in wishlist" })
    }

    // Remove tutor from wishlist
    wishlist.tutors.splice(index, 1)

    await wishlist.save()

    res.json(wishlist)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
}

