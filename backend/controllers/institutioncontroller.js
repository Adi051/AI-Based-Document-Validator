const Institution = require("../models/institution");

// ✅ CREATE INSTITUTION (ADMIN ONLY)
exports.createInstitution = async (req, res) => {
  try {
    const { name, code, email } = req.body;

    if (!name || !code || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const exists = await Institution.findOne({ code });
    if (exists) {
      return res.status(400).json({ message: "Institution code already exists" });
    }

    const institution = await Institution.create({
      name,
      code,
      email,
      createdBy: req.userId, // 🔥 admin id from token
    });

    res.status(201).json({
      success: true,
      message: "Institution created successfully",
      institution,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ GET ALL INSTITUTIONS
exports.getAllInstitutions = async (req, res) => {
  try {
    const institutions = await Institution.find()
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 });

    res.json(institutions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ DELETE INSTITUTION
exports.deleteInstitution = async (req, res) => {
  try {
    await Institution.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Institution deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ BLOCK / ACTIVATE
exports.toggleInstitutionStatus = async (req, res) => {
  try {
    const institution = await Institution.findById(req.params.id);
    if (!institution) {
      return res.status(404).json({ message: "Institution not found" });
    }

    institution.status =
      institution.status === "Active" ? "Blocked" : "Active";

    await institution.save();

    res.json({
      success: true,
      status: institution.status,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
