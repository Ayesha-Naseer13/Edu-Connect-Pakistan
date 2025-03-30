const mongoose = require("mongoose")

const TutorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  bio: {
    type: String,
    required: [true, "Please provide a bio"],
  },
  education: {
    type: String,
    required: [true, "Please provide education details"],
  },
  experience: {
    type: String,
    required: [true, "Please provide experience details"],
  },
  subjects: {
    type: [String],
    required: [true, "Please provide at least one subject"],
  },
  hourlyRate: {
    type: Number,
    required: [true, "Please provide an hourly rate"],
  },
  location: {
    type: String,
    required: [true, "Please provide a location"],
  },
  availability: {
    type: Object,
    default: {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: [],
    },
  },
  rating: {
    type: Number,
    default: 0,
  },
  reviewCount: {
    type: Number,
    default: 0,
  },
  profilePicture: {
    type: String,
    default: null,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verifiedAt: {
    type: Date,
    default: null,
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  isRejected: {
    type: Boolean,
    default: false,
  },
  rejectedAt: {
    type: Date,
    default: null,
  },
  rejectedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  rejectionReason: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("Tutor", TutorSchema)

