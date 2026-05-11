const express = require("express");
const { getMyHistory, createHistoryEntry } = require("../controllers/historycontroller");
const auth = require("../middelwares/authmiddleware");
const History = require("../models/historymodel"); // <-- FIX Added

const router = express.Router();

// Get current user's history
router.get("/me", auth, getMyHistory);

// Create history entry
router.post("/", auth, createHistoryEntry);

// Delete history entry
router.delete("/:id", auth, async (req, res) => {
  try {
    const historyId = req.params.id;
    const userId = req.userId;

    // Pehle correct record delete karne ki koshish
    let deleted = await History.findOneAndDelete({
      _id: historyId,
      user: userId
    });

    // Agar purana record user field ke bina saved hai
    if (!deleted) {
      deleted = await History.findByIdAndDelete(historyId);
    }

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Not found / unauthorized"
      });
    }

    res.json({ success: true, message: "History deleted successfully" });

  } catch (err) {
    console.log("History delete error:", err);
    res.status(500).json({ success: false, message: "Delete failed" });
  }
});

module.exports = router;
