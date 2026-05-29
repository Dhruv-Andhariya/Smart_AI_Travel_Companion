const express = require("express");
const tripController = require("../controllers/tripController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/trip/create", authMiddleware, tripController.createTrip);
router.get("/trips", authMiddleware, tripController.getTrips);
router.get("/trip/:id", authMiddleware, tripController.getTripById);
router.put("/trip/:id", authMiddleware, tripController.updateTrip);
router.delete("/trip/:id", authMiddleware, tripController.deleteTrip);

module.exports = router;
