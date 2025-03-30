const Tutor = require("../models/Tutor")
const User = require("../models/User")
const Review = require("../models/Review")

// Get all tutors
exports.getAllTutors = async (req, res) => {
  try {
    const tutors = await Tutor.find({ isVerified: true }).populate("user", "name email").sort({ rating: -1 })

    res.json(tutors)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
}

// Get featured tutors
exports.getFeaturedTutors = async (req, res) => {
  try {
    const tutors = await Tutor.find({ isVerified: true }).populate("user", "name email").sort({ rating: -1 }).limit(6)

    res.json(tutors)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
}

// Search tutors
exports.searchTutors = async (req, res) => {
  try {
    const { subject, location, rating, price } = req.query

    const query = { isVerified: true }

    if (subject) {
      query.subjects = { $in: [subject] }
    }

    if (location) {
      query.location = location
    }

    if (rating) {
      query.rating = { $gte: Number.parseFloat(rating) }
    }

    if (price) {
      const [min, max] = price.split("-")
      query.hourlyRate = {
        $gte: Number.parseInt(min || 0),
        $lte: Number.parseInt(max || 10000),
      }
    }

    const tutors = await Tutor.find(query).populate("user", "name email").sort({ rating: -1 })

    res.json(tutors)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
}

// Get tutor by ID
exports.getTutorById = async (req, res) => {
  try {
    const tutor = await Tutor.findById(req.params.id).populate("user", "name email")

    if (!tutor) {
      return res.status(404).json({ message: "Tutor not found" })
    }

    res.json(tutor)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
}

// Create tutor profile
exports.createTutorProfile = async (req, res) => {
  try {
    const { bio, education, experience, subjects, hourlyRate, location, availability } = req.body

    // Check if user already has a tutor profile
    let tutor = await Tutor.findOne({ user: req.user.id })
    if (tutor) {
      return res.status(400).json({ message: "Tutor profile already exists" })
    }

    // Update user role to tutor
    await User.findByIdAndUpdate(req.user.id, { role: "tutor" })

    // Create new tutor profile
    tutor = new Tutor({
      user: req.user.id,
      bio,
      education,
      experience,
      subjects,
      hourlyRate,
      location,
      availability,
      profilePicture: req.file ? `/uploads/${req.file.filename}` : null,
    })

    await tutor.save()

    res.status(201).json(tutor)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
}

// Update tutor profile
exports.updateTutorProfile = async (req, res) => {
  try {
    const { bio, education, experience, subjects, hourlyRate, location, availability } = req.body

    // Find tutor profile
    const tutor = await Tutor.findOne({ user: req.user.id })
    if (!tutor) {
      return res.status(404).json({ message: "Tutor profile not found" })
    }

    // Update profile
    tutor.bio = bio || tutor.bio
    tutor.education = education || tutor.education
    tutor.experience = experience || tutor.experience
    tutor.subjects = subjects || tutor.subjects
    tutor.hourlyRate = hourlyRate || tutor.hourlyRate
    tutor.location = location || tutor.location
    tutor.availability = availability || tutor.availability

    if (req.file) {
      tutor.profilePicture = `/uploads/${req.file.filename}`
    }

    await tutor.save()

    res.json(tutor)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
}

// Get tutor profile
exports.getTutorProfile = async (req, res) => {
  try {
    // Check if req.user exists
    if (!req.user) {
      console.error("User not authenticated or req.user not set by middleware")
      return res.status(401).json({ message: "User not authenticated" })
    }

    console.log("Fetching profile for user ID:", req.user.id)

    const tutor = await Tutor.findOne({ user: req.user.id }).populate("user", "name email")

    if (!tutor) {
      return res.status(404).json({ message: "Tutor profile not found" })
    }

    res.json(tutor)
  } catch (err) {
    console.error("Error fetching tutor profile:", err)
    res.status(500).json({ message: "Server error", error: err.message })
  }
}

// Get tutor reviews
exports.getTutorReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ tutor: req.params.id }).populate("student", "name")

    res.json(reviews)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
}

// Get tutor availability
exports.getTutorAvailability = async (req, res) => {
  try {
    const tutor = await Tutor.findById(req.params.id)

    if (!tutor) {
      return res.status(404).json({ message: "Tutor not found" })
    }

    res.json(tutor.availability)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
}

// Update tutor availability
exports.updateTutorAvailability = async (req, res) => {
  try {
    const { availability } = req.body

    // Find tutor profile
    const tutor = await Tutor.findOne({ user: req.user.id })
    if (!tutor) {
      return res.status(404).json({ message: "Tutor profile not found" })
    }

    // Update availability
    tutor.availability = availability

    await tutor.save()

    res.json(tutor.availability)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
}

