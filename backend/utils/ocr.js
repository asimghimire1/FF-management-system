const Tesseract = require("tesseract.js");
const fs = require("fs");
const path = require("path");

// Parse OCR text for leaderboard data
const parseLeaderboardText = (text) => {
  const lines = text.split("\n").filter((line) => line.trim());
  const entries = [];

  for (const line of lines) {
    // Expected format: "Team Name | Kills | Placement"
    const parts = line.split("|").map((part) => part.trim());

    if (parts.length >= 3) {
      const teamName = parts[0];
      const kills = parseInt(parts[1], 10);
      const placement = parseInt(parts[2], 10);

      if (!isNaN(kills) && !isNaN(placement) && teamName) {
        entries.push({
          teamName,
          kills,
          placement,
        });
      }
    }
  }

  // Sort by placement
  return entries.sort((a, b) => a.placement - b.placement);
};

// Extract text from image using Tesseract
const extractTextFromImage = async (imagePath) => {
  try {
    const result = await Tesseract.recognize(imagePath, "eng", {
      logger: (m) => console.log("OCR Progress:", m.progress),
    });

    return result.data.text;
  } catch (error) {
    console.error("OCR Error:", error.message);
    throw new Error("Failed to extract text from image");
  }
};

// Full OCR pipeline: extract text and parse leaderboard
const processLeaderboardImage = async (imagePath) => {
  try {
    const rawText = await extractTextFromImage(imagePath);
    const leaderboardData = parseLeaderboardText(rawText);

    if (leaderboardData.length === 0) {
      throw new Error("No valid leaderboard entries found in image");
    }

    return leaderboardData;
  } catch (error) {
    console.error("Leaderboard Processing Error:", error.message);
    throw error;
  }
};

module.exports = {
  extractTextFromImage,
  parseLeaderboardText,
  processLeaderboardImage,
};
