const History = require("../models/historymodel");

// GET /history/me -> return all history for logged-in user
exports.getMyHistory = async (req, res) => {
  try {
    const userId = req.userId;

    const docs = await History.find({ user: userId }).sort({ createdAt: -1 });

    // Shape data similar to your frontend expectations
    const formatted = docs.map((doc) => ({
      _id: doc._id,
      image: doc.image,
      explanation: doc.explanation,
      timestamp: doc.createdAt,
    }));

    res.json(formatted);
  } catch (err) {
    console.error("History fetch error:", err);
    res.status(500).json({ message: "Failed to fetch history" });
  }
};

// POST /history -> create a new history record
// body: { image, explanation }
exports.createHistoryEntry = async (req, res) => {
  try {
    const userId = req.userId;
    const { image, explanation } = req.body;

    if (!image || !explanation) {
      return res
        .status(400)
        .json({ message: "image and explanation are required" });
    }

    const entry = await History.create({
      user: userId,
      image,
      explanation,
    });

    res.status(201).json({
      success: true,
      message: "History entry created",
      data: entry,
    });
  } catch (err) {
    console.error("History create error:", err);
    res.status(500).json({ message: "Failed to create history entry" });
  }
};
