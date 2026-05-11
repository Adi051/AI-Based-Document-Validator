const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
  fileName: String,
  image: String, // 🔥 add this

  documentType: String,
  documentText: String,
  documentHash: String,

  isOriginal: {
    type: Boolean,
    default: false,
  },

  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  subType: {
  type: String,
  default: "unknown"
}
});

module.exports = mongoose.model("History", historySchema);