const Review = require("../models/Review")
const Tutor = require("../models/Tutor")
const Session = require("../models/Session")

// Create a review
exports.createReview = async (req, res) => {
  try {
    const { rating, comment, sessionId } = req.body

    // Check if tutor exists
    const tutor = await Tutor.findById(req.params.tutorId)
    if (!tutor) {
      return res.status(404).json({ message: "Tutor not found" })
    }

    // Check if session exists if sessionId is provided
    if (sessionId) {
      const session = await Session.findById(sessionId)
      if (!session) {
        return res.status(404).json({ message: "Session not found" })
      }

      // Check if user is authorized to review this session
      if (session.student.toString() !== req.user.id) {
        return res.status(403).json({ message: "Not authorized" })
      }

      // Check if session is completed
      if (session.status !== "completed") {
        return res.status(400).json({ message: "Cannot review an incomplete session" })
      }

      // Check if session is already reviewed
      if (session.isReviewed) {
        return res.status(400).json({ message: "Session already reviewed" })
      }
    }

    // Create review
    const review = new Review({
      tutor: req.params.tutorId,
      student: req.user.id,
      session: sessionId,
      rating,
      comment,
    })

    await review.save()

    // Update session if sessionId is provided
    if (sessionId) {
      await Session.findByIdAndUpdate(sessionId, {
        isReviewed: true,
        review: review._id,
      })
    }

    // Update tutor rating
    const reviews = await Review.find({ tutor: req.params.tutorId })
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
    const averageRating = totalRating / reviews.length

    await Tutor.findByIdAndUpdate(req.params.tutorId, {
      rating: averageRating,
      reviewCount: reviews.length,
    })

    res.status(201).json(review)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
}

// Get tutor reviews
exports.getTutorReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ tutor: req.params.tutorId }).populate("student", "name").sort({ createdAt: -1 })

    res.json(reviews)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
}

// Update review
exports.updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body

    // Find review
    const review = await Review.findById(req.params.id)

    if (!review) {
      return res.status(404).json({ message: "Review not found" })
    }

    // Check if user is authorized to update this review
    if (review.student.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" })
    }

    // Update review
    review.rating = rating || review.rating
    review.comment = comment || review.comment

    await review.save()

    // Update tutor rating
    const reviews = await Review.find({ tutor: review.tutor })
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
    const averageRating = totalRating / reviews.length

    await Tutor.findByIdAndUpdate(review.tutor, {
      rating: averageRating,
    })

    res.json(review)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
}

// Delete review
exports.deleteReview = async (req, res) => {
  try {
    // Find review
    const review = await Review.findById(req.params.id)

    if (!review) {
      return res.status(404).json({ message: "Review not found" })
    }

    // Check if user is authorized to delete this review
    if (review.student.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" })
    }

    // Delete review
    await review.remove()

    // Update tutor rating
    const reviews = await Review.find({ tutor: review.tutor })

    if (reviews.length === 0) {
      await Tutor.findByIdAndUpdate(review.tutor, {
        rating: 0,
        reviewCount: 0,
      })
    } else {
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
      const averageRating = totalRating / reviews.length

      await Tutor.findByIdAndUpdate(review.tutor, {
        rating: averageRating,
        reviewCount: reviews.length,
      })
    }

    res.json({ message: "Review deleted" })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
}

