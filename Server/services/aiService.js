const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const extractFirstJson = (text) => {
  if (!text || typeof text !== "string") return null;
  // Try to find a JSON array first
  const arrayMatch = text.match(/\[([\s\S]*?)\]/);
  if (arrayMatch) return arrayMatch[0];
  // Fallback to first JSON object
  const objMatch = text.match(/\{([\s\S]*?)\}/);
  if (objMatch) return objMatch[0];
  return null;
};

const generateItinerary = async (tripData) => {
  const prompt = `Generate a travel itinerary in JSON format.

Destination: ${tripData.destination}
Days: ${tripData.totalDays}
Budget: ${tripData.budget}
Travel Type: ${tripData.travelType}
Interests: ${tripData.interests}

Return ONLY valid JSON (an array of day objects).

Format:
[
  {"dayNumber":1, "title":"Day title", "description":"Detailed plan"}
]
`;

  const response = await groq.chat.completions.create({
    messages: [
      { role: "user", content: prompt },
    ],
    model: "llama-3.3-70b-versatile",
    temperature: 0.2,
  });

  const rawContent = response?.choices?.[0]?.message?.content ?? "";

  // First try direct parse
  try {
    return JSON.parse(rawContent);
  } catch (err) {
    // Try to extract a JSON blob from the text
    const extracted = extractFirstJson(rawContent);
    if (extracted) {
      try {
        return JSON.parse(extracted);
      } catch (err2) {
        // fall through to throw below
      }
    }
    // If parsing still fails, throw an error that includes the raw content for debugging
    const preview = rawContent.slice(0, 4000);
    throw new Error(`Failed to parse AI response as JSON. Raw response (first 4000 chars): ${preview}`);
  }
};

module.exports = {
  generateItinerary,
  groq,
};