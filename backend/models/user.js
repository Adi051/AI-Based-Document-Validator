const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
{
name: { type: String, required: true },
email: { type: String, required: true, unique: true },
password: { type: String, required: true },

role: {
type: String,
enum: ["Student", "Institution Admin", "Super Admin"],
default: "Student",
},

status: {
type: String,
enum: ["Active", "Pending", "Blocked"],
default: "Active",
},

createdBy: {
type: mongoose.Schema.Types.ObjectId,
ref: "User",
default: null,
},

// 🔥 PROFILE
phone: { type: String, default: "" },
institution: { type: String, default: "" },
bio: { type: String, default: "" },
location: { type: String, default: "" },
avatar: { type: String, default: "" },

// 🔥 DOCUMENT VERIFICATION (UPGRADED)
prn: { type: String, unique: true, sparse: true }, // 🔥 NEW (IMPORTANT)
college: { type: String, default: "" },

documentHash: { type: String, default: "" },
documentText: { type: String, default: "" }, // 🔥 for plagiarism
documentType: { type: String, default: "" }, // 🔥 aadhaar/pan/result/etc

lastLogin: { type: Date },

},
{ timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
