const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const VALID_TRAVEL_TYPES = new Set(["SOLO", "FRIENDS", "FAMILY", "COUPLE", "BUSINESS"]);

function normalizeTravelType(value) {
  if (!value) return null;
  const normalized = String(value).trim().toUpperCase();
  if (normalized === "WORK") return "BUSINESS";
  return VALID_TRAVEL_TYPES.has(normalized) ? normalized : null;
}

const createTrip = async (req, res) => {
  try {
    const { title, destination, budget, totalDays, travelType, interests } = req.body;
    const parsedBudget = Number(budget);
    const parsedTotalDays = Number(totalDays);
    const normalizedTravelType = normalizeTravelType(travelType);

    if (!title || !destination || !Number.isFinite(parsedBudget) || !Number.isInteger(parsedTotalDays) || parsedTotalDays < 1 || !normalizedTravelType) {
      return res.status(400).json({
        message: "Invalid trip details. Please check title, destination, budget, days, and travel type.",
      });
    }

    const newTrip = await prisma.trip.create({
      data: {
        title: String(title).trim(),
        destination: String(destination).trim(),
        budget: parsedBudget,
        totalDays: parsedTotalDays,
        travelType: normalizedTravelType,
        interests: interests ? String(interests).trim() : null,
        userId: req.user.userId,
      },
    });

    res.status(201).json({
      message: "Trip created successfully",
      trip: newTrip,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getTrips = async (req, res) => {
  try {
    const trips = await prisma.trip.findMany({
      where: {
        userId: req.user.userId,
      },
    });

    res.status(200).json({
      trips: trips,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getTripById = async (req, res) => {
  try {
    const tripId = parseInt(req.params.id);

    const trip = await prisma.trip.findFirst({
      where: {
        id: tripId,
        userId: req.user.userId,
      },
    });

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found",
      });
    }

    res.status(200).json({
      trip: trip,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const updateTrip = async (req, res) => {
  try {
    const tripId = parseInt(req.params.id);
    const { title, destination, budget, totalDays, travelType, interests } = req.body;
    const parsedBudget = Number(budget);
    const parsedTotalDays = Number(totalDays);
    const normalizedTravelType = normalizeTravelType(travelType);

    if (!title || !destination || !Number.isFinite(parsedBudget) || !Number.isInteger(parsedTotalDays) || parsedTotalDays < 1 || !normalizedTravelType) {
      return res.status(400).json({
        message: "Invalid trip details. Please check title, destination, budget, days, and travel type.",
      });
    }

    const existingTrip = await prisma.trip.findFirst({
      where: {
        id: tripId,
        userId: req.user.userId,
      },
    });

    if (!existingTrip) {
      return res.status(404).json({
        message: "Trip not found",
      });
    }

    const updatedTrip = await prisma.trip.update({
      where: {
        id: tripId,
      },
      data: {
        title: String(title).trim(),
        destination: String(destination).trim(),
        budget: parsedBudget,
        totalDays: parsedTotalDays,
        travelType: normalizedTravelType,
        interests: interests ? String(interests).trim() : null,
      },
    });

    res.status(200).json({
      message: "Trip updated successfully",
      trip: updatedTrip,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const deleteTrip = async (req, res) => {
  try {
    const tripId = parseInt(req.params.id);

    const trip = await prisma.trip.findFirst({
      where: {
        id: tripId,
        userId: req.user.userId,
      },
    });

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found",
      });
    }

    await prisma.trip.delete({
      where: {
        id: tripId,
      },
    });

    res.status(200).json({
      message: "Trip deleted successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = {
  createTrip,
  getTrips,
  getTripById,
  updateTrip,
  deleteTrip,
};
