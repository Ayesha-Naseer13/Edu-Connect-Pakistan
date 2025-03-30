const Session = require("../models/Session")
const Tutor = require("../models/Tutor")
const User = require("../models/User")
const Review = require("../models/Review") // Import the Review model

// Book a new session
exports.bookSession = async (req, res) => {
  try {
    const { tutorId, date, startTime, endTime, subject, notes } = req.body

    // Check if tutor exists
    const tutor = await Tutor.findById(tutorId)
    if (!tutor) {
      return res.status(404).json({ message: "Tutor not found" })
    }

    // Create new session
    const session = new Session({
      tutor: tutorId,
      student: req.user.id,
      date,
      startTime,
      endTime,
      subject,
      notes,
      status: "pending",
    })

    await session.save()

    res.status(201).json(session)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
}

// Get user sessions (for both students and tutors)
exports.getUserSessions = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)

    let sessions
    if (user.role === "student") {
      sessions = await Session.find({ student: req.user.id })
        .populate("tutor", "user")
        .populate({
          path: "tutor",
          populate: {
            path: "user",
            select: "name email",
          },
        })
        .sort({ date: 1 })
    } else if (user.role === "tutor") {
      const tutorProfile = await Tutor.findOne({ user: req.user.id })

      if (!tutorProfile) {
        return res.status(404).json({ message: "Tutor profile not found" })
      }

      sessions = await Session.find({ tutor: tutorProfile._id }).populate("student", "name email").sort({ date: 1 })
    }

    res.json(sessions)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
}

// Get session by ID
exports.getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate("tutor", "user")
      .populate({
        path: "tutor",
        populate: {
          path: "user",
          select: "name email",
        },
      })
      .populate("student", "name email")

    if (!session) {
      return res.status(404).json({ message: "Session not found" })
    }

    // Check if user is authorized to view this session
    const user = await User.findById(req.user.id)

    if (user.role === "student" && session.student.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" })
    }

    if (user.role === "tutor") {
      const tutorProfile = await Tutor.findOne({ user: req.user.id })

      if (!tutorProfile || session.tutor.toString() !== tutorProfile._id.toString()) {
        return res.status(403).json({ message: "Not authorized" })
      }
    }

    res.json(session)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
}

// Update session
exports.updateSession = async (req, res) => {
  try {
    const { status, notes } = req.body

    // Find session
    const session = await Session.findById(req.params.id)

    if (!session) {
      return res.status(404).json({ message: "Session not found" })
    }

    // Check if user is authorized to update this session
    const user = await User.findById(req.user.id)

    if (user.role === "student" && session.student.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" })
    }

    if (user.role === "tutor") {
      const tutorProfile = await Tutor.findOne({ user: req.user.id })

      if (!tutorProfile || session.tutor.toString() !== tutorProfile._id.toString()) {
        return res.status(403).json({ message: "Not authorized" })
      }
    }

    // Update session
    if (status) session.status = status
    if (notes) session.notes = notes

    await session.save()

    res.json(session)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
}

// Cancel session
exports.cancelSession = async (req, res) => {
  try {
    // Find session
    const session = await Session.findById(req.params.id)

    if (!session) {
      return res.status(404).json({ message: "Session not found" })
    }

    // Check if user is authorized to cancel this session
    const user = await User.findById(req.user.id)

    if (user.role === "student" && session.student.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" })
    }

    if (user.role === "tutor") {
      const tutorProfile = await Tutor.findOne({ user: req.user.id })

      if (!tutorProfile || session.tutor.toString() !== tutorProfile._id.toString()) {
        return res.status(403).json({ message: "Not authorized" })
      }
    }

    // Update session status to cancelled
    session.status = "cancelled"
    session.cancelledBy = req.user.id
    session.cancelledAt = Date.now()

    await session.save()

    res.json(session)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
}

// Complete session
exports.completeSession = async (req, res) => {
  try {
    // Find session
    const session = await Session.findById(req.params.id)

    if (!session) {
      return res.status(404).json({ message: "Session not found" })
    }

    // Only tutors can mark sessions as complete
    const user = await User.findById(req.user.id)

    if (user.role !== "tutor") {
      return res.status(403).json({ message: "Not authorized" })
    }

    const tutorProfile = await Tutor.findOne({ user: req.user.id })

    if (!tutorProfile || session.tutor.toString() !== tutorProfile._id.toString()) {
      return res.status(403).json({ message: "Not authorized" })
    }

    // Update session status to completed
    session.status = "completed"
    session.completedAt = Date.now()

    await session.save()

    res.json(session)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
}

// Review session
exports.reviewSession = async (req, res) => {
  try {
    const { rating, comment } = req.body

    // Find session
    const session = await Session.findById(req.params.id)

    if (!session) {
      return res.status(404).json({ message: "Session not found" })
    }

    // Only students can review sessions
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

    // Create review
    const review = new Review({
      session: session._id,
      tutor: session.tutor,
      student: req.user.id,
      rating,
      comment,
    })

    await review.save()

    // Update session
    session.isReviewed = true
    session.review = review._id

    await session.save()

    // Update tutor rating
    const tutor = await Tutor.findById(session.tutor)
    const reviews = await Review.find({ tutor: session.tutor })

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
    const averageRating = totalRating / reviews.length

    tutor.rating = averageRating
    tutor.reviewCount = reviews.length

    await tutor.save()

    res.json(review)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
}

