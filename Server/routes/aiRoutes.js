const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  generateTripItinerary,
  chatWithAI
} = require("../controllers/aiController");

router.post(
  "/itinerary/:tripId",
  authMiddleware,
  generateTripItinerary
);
router.post(
  "/chat",
  authMiddleware,
  chatWithAI
);

router.get("/chat", (req, res) => {
  res.status(405).json({
    message: "Use POST /ai/chat with a JSON body like { \"message\": \"...\" }",
  });
});

module.exports = router;