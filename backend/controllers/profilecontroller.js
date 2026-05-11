const User = require("../models/user");
const bcrypt = require("bcryptjs");

// GET PROFILE
exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user)
      return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE PROFILE
exports.updateProfile = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      {
        name: req.body.name,
        phone: req.body.phone,
        institution: req.body.institution,
        bio: req.body.bio,
      },
      { new: true }
    ).select("-password");

    res.json({ success: true, user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteMyAccount = async (req, res) => {
  try {
    const { password } = req.body;

    const user = await User.findById(req.userId);
    if (!user)
      return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Incorrect password" });

    await User.findByIdAndDelete(req.userId);

    res.json({ success: true, message: "Account deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
