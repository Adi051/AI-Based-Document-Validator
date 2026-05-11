const Settings = require("../models/settingsmodel");

// GET MY SETTINGS
exports.getMySettings = async (req, res) => {
  try {
    let settings = await Settings.findOne({ user: req.userId });

    // Agar first time user hai → default create
    if (!settings) {
      settings = await Settings.create({ user: req.userId });
    }

    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE MY SETTINGS
exports.updateMySettings = async (req, res) => {
  try {
    const updated = await Settings.findOneAndUpdate(
      { user: req.userId },
      req.body,
      { new: true, upsert: true }
    );

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
