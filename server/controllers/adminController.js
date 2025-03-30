const Tutor = require("../models/Tutor")
const User = require("../models/User")
const Session = require("../models/Session")
const Review = require("../models/Review")

// Get pending tutors
exports.getPendingTutors = async (req, res) => {
  try {
    const tutors = await Tutor.find({ isVerified: false }).populate("user", "name email").sort({ createdAt: -1 })

    res.json(tutors)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
}

// Verify tutor
exports.verifyTutor = async (req, res) => {
  try {
    const tutor = await Tutor.findById(req.params.id)

    if (!tutor) {
      return res.status(404).json({ message: "Tutor not found" })
    }

    tutor.isVerified = true
    tutor.verifiedAt = Date.now()
    tutor.verifiedBy = req.user.id

    await tutor.save()

    res.json(tutor)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
}

// Reject tutor
exports.rejectTutor = async (req, res) => {
  try {
    const { reason } = req.body

    const tutor = await Tutor.findById(req.params.id)

    if (!tutor) {
      return res.status(404).json({ message: "Tutor not found" })
    }

    tutor.isRejected = true
    tutor.rejectedAt = Date.now()
    tutor.rejectedBy = req.user.id
    tutor.rejectionReason = reason

    await tutor.save()

    res.json(tutor)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
}

// Get reports
exports.getReports = async (req, res) => {
  try {
    // Get total users count
    const totalUsers = await User.countDocuments()
    const totalStudents = await User.countDocuments({ role: "student" })
    const totalTutors = await User.countDocuments({ role: "tutor" })

    // Get total sessions count
    const totalSessions = await Session.countDocuments()
    const completedSessions = await Session.countDocuments({ status: "completed" })
    const pendingSessions = await Session.countDocuments({ status: "pending" })
    const cancelledSessions = await Session.countDocuments({ status: "cancelled" })

    // Get total reviews count
    const totalReviews = await Review.countDocuments()

    // Get average rating
    const reviews = await Review.find()
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0

    // Get top subjects
    const tutors = await Tutor.find()
    const subjects = {}

    tutors.forEach((tutor) => {
      tutor.subjects.forEach((subject) => {
        if (subjects[subject]) {
          subjects[subject]++
        } else {
          subjects[subject] = 1
        }
      })
    })

    const topSubjects = Object.entries(subjects)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([subject, count]) => ({ subject, count }))

    res.json({
      users: {
        total: totalUsers,
        students: totalStudents,
        tutors: totalTutors,
      },
      sessions: {
        total: totalSessions,
        completed: completedSessions,
        pending: pendingSessions,
        cancelled: cancelledSessions,
      },
      reviews: {
        total: totalReviews,
        averageRating,
      },
      topSubjects,
    })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
}

// Get analytics
exports.getAnalytics = async (req, res) => {
  try {
    // Get sessions per month for the last 6 months
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const sessions = await Session.find({
      createdAt: { $gte: sixMonthsAgo },
    })

    const sessionsByMonth = {}

    sessions.forEach((session) => {
      const month = new Date(session.createdAt).toLocaleString("default", { month: "long" })

      if (sessionsByMonth[month]) {
        sessionsByMonth[month]++
      } else {
        sessionsByMonth[month] = 1
      }
    })

    // Get new users per month for the last 6 months
    const users = await User.find({
      createdAt: { $gte: sixMonthsAgo },
    })

    const usersByMonth = {}

    users.forEach((user) => {
      const month = new Date(user.createdAt).toLocaleString("default", { month: "long" })

      if (usersByMonth[month]) {
        usersByMonth[month]++
      } else {
        usersByMonth[month] = 1
      }
    })

    res.json({
      sessionsByMonth,
      usersByMonth,
    })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
}

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 })

    res.json(users)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
}

// Update user status
exports.updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body

    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    user.status = status

    await user.save()

    res.json(user)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
}

