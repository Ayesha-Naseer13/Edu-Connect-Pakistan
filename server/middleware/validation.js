// Validate registration input
exports.validateRegistration = (req, res, next) => {
  const { name, email, password, role } = req.body

  // Check if all fields are provided
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please provide all required fields" })
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Please provide a valid email address" })
  }

  // Validate password length
  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters long" })
  }

  // Validate role if provided
  if (role && !["student", "tutor", "admin"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" })
  }

  next()
}

// Validate login input
exports.validateLogin = (req, res, next) => {
  const { email, password } = req.body

  // Check if all fields are provided
  if (!email || !password) {
    return res.status(400).json({ message: "Please provide email and password" })
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Please provide a valid email address" })
  }

  next()
}

// Validate tutor profile input
exports.validateTutorProfile = (req, res, next) => {
  const { bio, education, experience, subjects, hourlyRate, location } = req.body

  // Check if all required fields are provided
  if (!bio || !education || !experience || !subjects || !hourlyRate || !location) {
    return res.status(400).json({ message: "Please provide all required fields" })
  }

  // Validate hourly rate
  if (isNaN(hourlyRate) || hourlyRate <= 0) {
    return res.status(400).json({ message: "Hourly rate must be a positive number" })
  }

  // Validate subjects (should be an array)
  if (!Array.isArray(subjects) || subjects.length === 0) {
    return res.status(400).json({ message: "Please provide at least one subject" })
  }

  next()
}

// Validate session input
exports.validateSession = (req, res, next) => {
  const { tutorId, date, startTime, endTime, subject } = req.body

  // Check if all required fields are provided
  if (!tutorId || !date || !startTime || !endTime || !subject) {
    return res.status(400).json({ message: "Please provide all required fields" })
  }

  // Validate date format (YYYY-MM-DD)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/
  if (!dateRegex.test(date)) {
    return res.status(400).json({ message: "Invalid date format. Please use YYYY-MM-DD" })
  }

  // Validate time format (HH:MM)
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/
  if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
    return res.status(400).json({ message: "Invalid time format. Please use HH:MM (24-hour format)" })
  }

  // Validate that end time is after start time
  const start = new Date(`${date}T${startTime}`)
  const end = new Date(`${date}T${endTime}`)

  if (end <= start) {
    return res.status(400).json({ message: "End time must be after start time" })
  }

  next()
}

// Validate review input
exports.validateReview = (req, res, next) => {
  const { rating, comment } = req.body

  // Check if all required fields are provided
  if (!rating) {
    return res.status(400).json({ message: "Please provide a rating" })
  }

  // Validate rating
  if (isNaN(rating) || rating < 1 || rating > 5) {
    return res.status(400).json({ message: "Rating must be a number between 1 and 5" })
  }

  next()
}

