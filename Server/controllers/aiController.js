const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const { generateItinerary, groq } = require("../services/aiService");

const generateTripItinerary = async (req, res) => {
  try {
    const tripId = parseInt(req.params.tripId);

    const trip = await prisma.trip.findFirst({
      where: {
        id: tripId,
        userId: req.user.userId,
      },
    });

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    // Ask AI service to generate itinerary (should return an array)
    const itinerary = await generateItinerary(trip);

    if (!Array.isArray(itinerary)) {
      return res.status(502).json({
        message: "AI did not return valid JSON itinerary",
        raw: itinerary,
      });
    }

    // Save generated itinerary items to DB
    await prisma.itinerary.createMany({
      data: itinerary.map((day) => ({
        dayNumber: day.dayNumber,
        title: day.title,
        description: day.description,
        tripId: trip.id,
      })),
    });

    res.status(200).json({
      message: "AI itinerary generated successfully",
      itinerary,
    });
  } catch (error) {
    console.error("generateTripItinerary error:", error);
    res.status(500).json({ message: "Failed to generate itinerary", error: error.message });
  }
};
const chatWithAI = async (req, res) => {

  try {

    const { message } = req.body;

    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        message: "message is required",
      });
    }

    const response = await groq.chat.completions.create({

      messages: [

        {
          role: "system",
          content: "You are a smart AI travel assistant."
        },

        {
          role: "user",
          content: message.trim()
        }

      ],

      model: "llama-3.3-70b-versatile"

    });

    res.status(200).json({
      reply: response.choices[0].message.content
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Failed to chat with AI"
    });

  }

};
module.exports = {
  generateTripItinerary,
  chatWithAI
};