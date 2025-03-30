const multer = require("multer")
const path = require("path")
const { v4: uuidv4 } = require("uuid")

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/")
  },
  filename: (req, file, cb) => {
    const uniqueFilename = `${uuidv4()}-${file.originalname}`
    cb(null, uniqueFilename)
  },
})

// Check file type
const fileFilter = (req, file, cb) => {
  // Allowed file extensions
  const filetypes = /jpeg|jpg|png|gif|pdf|doc|docx/

  // Check extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())

  // Check mime type
  const mimetype = filetypes.test(file.mimetype)

  if (mimetype && extname) {
    return cb(null, true)
  } else {
    cb(new Error("Invalid file type. Only JPEG, JPG, PNG, GIF, PDF, DOC, and DOCX files are allowed."))
  }
}

// Set up multer
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }
})
module.exports = upload // Changed from exports.upload
