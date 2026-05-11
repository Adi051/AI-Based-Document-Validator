const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // Appearance
    theme: { type: String, default: "auto" },
    fontSize: { type: String, default: "medium" },
    compactSidebar: { type: Boolean, default: false },

    // Verification
    aiSensitivity: { type: Number, default: 75 },
    plagiarismThreshold: { type: Number, default: 85 },
    watermark: { type: Boolean, default: true },
    allowPDF: { type: Boolean, default: true },
    allowImages: { type: Boolean, default: true },
    allowDocs: { type: Boolean, default: false },

    // Security
    twoFA: { type: Boolean, default: false },
    blockchainMode: { type: String, default: "hybrid" },
    reAuthNeeded: { type: Boolean, default: true },

    // Notifications
    emailAlerts: { type: Boolean, default: true },
    weeklySummary: { type: Boolean, default: true },
    systemIncidents: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Settings", settingsSchema);
