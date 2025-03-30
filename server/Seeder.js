const mongoose = require("mongoose")
const dotenv = require("dotenv")
const colors = require("colors")
const bcrypt = require("bcryptjs")

// Load env vars
dotenv.config()

// Load models
const User = require("./models/User")
const Tutor = require("./models/Tutor")
const Session = require("./models/Session")
const Review = require("./models/Review")
const Wishlist = require("./models/Wishlist")

// Connect to DB
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/educonnect")
  .then(() => console.log("MongoDB Connected".cyan.underline))
  .catch((err) => {
    console.error("MongoDB Connection Error:".red.bold, err)
    process.exit(1)
  })

// Sample data
const users = [
  {
    name: "Admin User",
    email: "admin@example.com",
    password: bcrypt.hashSync("password123", 10),
    role: "admin",
  },
  {
    name: "Student User",
    email: "student@example.com",
    password: bcrypt.hashSync("password123", 10),
    role: "student",
  },
  {
    name: "Tutor User",
    email: "tutor@example.com",
    password: bcrypt.hashSync("password123", 10),
    role: "tutor",
  },
  {
    name: "John Doe",
    email: "john@example.com",
    password: bcrypt.hashSync("password123", 10),
    role: "tutor",
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    password: bcrypt.hashSync("password123", 10),
    role: "tutor",
  },
]

const tutors = [
  {
    user: null, // Will be set after users are created
    bio: "Experienced math tutor with 5 years of teaching experience.",
    qualifications: "BS in Mathematics, Certified Teacher",
    subjects: ["Mathematics", "Calculus", "Algebra"],
    hourlyRate: 1500,
    location: "Lahore",
    isOnline: true,
    inPersonAvailable: true,
    rating: 4.8,
    availability: {
      monday: { available: true, slots: ["09:00-10:00", "14:00-15:00"] },
      tuesday: { available: true, slots: ["10:00-11:00", "15:00-16:00"] },
      wednesday: { available: true, slots: ["09:00-10:00", "14:00-15:00"] },
      thursday: { available: true, slots: ["10:00-11:00", "15:00-16:00"] },
      friday: { available: true, slots: ["09:00-10:00", "14:00-15:00"] },
      saturday: { available: false, slots: [] },
      sunday: { available: false, slots: [] },
    },
    verified: true,
  },
  {
    user: null, // Will be set after users are created
    bio: "Physics expert with PhD and research experience.",
    qualifications: "PhD in Physics, Research Assistant",
    subjects: ["Physics", "Mathematics", "Science"],
    hourlyRate: 2000,
    location: "Karachi",
    isOnline: true,
    inPersonAvailable: false,
    rating: 4.5,
    availability: {
      monday: { available: true, slots: ["16:00-17:00", "18:00-19:00"] },
      tuesday: { available: true, slots: ["16:00-17:00", "18:00-19:00"] },
      wednesday: { available: true, slots: ["16:00-17:00", "18:00-19:00"] },
      thursday: { available: true, slots: ["16:00-17:00", "18:00-19:00"] },
      friday: { available: true, slots: ["16:00-17:00", "18:00-19:00"] },
      saturday: { available: true, slots: ["10:00-11:00", "14:00-15:00"] },
      sunday: { available: false, slots: [] },
    },
    verified: true,
  },
  {
    user: null, // Will be set after users are created
    bio: "English language specialist with focus on literature and writing skills.",
    qualifications: "MA in English Literature, TEFL Certified",
    subjects: ["English", "Literature", "Writing"],
    hourlyRate: 1800,
    location: "Islamabad",
    isOnline: true,
    inPersonAvailable: true,
    rating: 4.9,
    availability: {
      monday: { available: true, slots: ["09:00-10:00", "14:00-15:00"] },
      tuesday: { available: true, slots: ["09:00-10:00", "14:00-15:00"] },
      wednesday: { available: true, slots: ["09:00-10:00", "14:00-15:00"] },
      thursday: { available: true, slots: ["09:00-10:00", "14:00-15:00"] },
      friday: { available: true, slots: ["09:00-10:00", "14:00-15:00"] },
      saturday: { available: true, slots: ["10:00-11:00", "14:00-15:00"] },
      sunday: { available: true, slots: ["10:00-11:00", "14:00-15:00"] },
    },
    verified: false,
  },
]

// Import data into DB
const importData = async () => {
  try {
    // Clear existing data
    await User.deleteMany()
    await Tutor.deleteMany()
    await Session.deleteMany()
    await Review.deleteMany()
    await Wishlist.deleteMany()

    console.log("Data cleared...".red.inverse)

    // Create users
    const createdUsers = await User.insertMany(users)
    console.log(`${createdUsers.length} users created...`.green)

    // Set user IDs for tutors
    const tutorUser = createdUsers.find((user) => user.email === "tutor@example.com")
    const johnUser = createdUsers.find((user) => user.email === "john@example.com")
    const janeUser = createdUsers.find((user) => user.email === "jane@example.com")

    tutors[0].user = tutorUser._id
    tutors[1].user = johnUser._id
    tutors[2].user = janeUser._id

    // Create tutors
    const createdTutors = await Tutor.insertMany(tutors)
    console.log(`${createdTutors.length} tutors created...`.green)

    // Create a session
    const studentUser = createdUsers.find((user) => user.email === "student@example.com")

    const session = {
      student: studentUser._id,
      tutor: tutorUser._id,
      tutorProfile: createdTutors[0]._id,
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      startTime: "14:00",
      endTime: "15:00",
      subject: "Mathematics",
      topic: "Calculus Basics",
      type: "online",
      status: "confirmed",
      price: 1500,
    }

    const createdSession = await Session.create(session)
    console.log("Sample session created...".green)

    // Create a review
    const review = {
      student: studentUser._id,
      tutor: tutorUser._id,
      tutorProfile: createdTutors[0]._id,
      session: createdSession._id,
      rating: 5,
      comment: "Excellent tutor! Very knowledgeable and patient.",
      date: new Date(),
    }

    await Review.create(review)
    console.log("Sample review created...".green)

    // Create a wishlist item
    const wishlistItem = {
      student: studentUser._id,
      tutor: johnUser._id,
      tutorProfile: createdTutors[1]._id,
    }

    await Wishlist.create(wishlistItem)
    console.log("Sample wishlist item created...".green)

    console.log("Data imported!".green.inverse)
    process.exit()
  } catch (error) {
    console.error(`${error}`.red.inverse)
    process.exit(1)
  }
}

// Execute the import
importData()

