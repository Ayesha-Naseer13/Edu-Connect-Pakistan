const express = require("express")
const router = express.Router()
const sessionController = require("../controllers/sessionController")
const { auth } = require("../middleware/auth")
const { validateSession } = require("../middleware/validation")

// Session routes
router.post("/", auth, validateSession, sessionController.bookSession)
router.get("/", auth, sessionController.getUserSessions)
router.get("/:id", auth, sessionController.getSessionById)
router.put("/:id", auth, sessionController.updateSession)
router.delete("/:id", auth, sessionController.cancelSession)
router.post("/:id/complete", auth, sessionController.completeSession)
router.post("/:id/review", auth, sessionController.reviewSession)

module.exports = router

