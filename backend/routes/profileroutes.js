const express = require("express");
const router = express.Router();
const auth = require("../middelwares/authmiddleware");
const {
  getMyProfile,
  updateProfile,
} = require("../controllers/profilecontroller");

router.get("/me", auth, getMyProfile);
router.put("/update", auth, updateProfile);

module.exports = router;
