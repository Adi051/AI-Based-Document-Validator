const express = require("express");
const router = express.Router();
const auth = require("../middelwares/authmiddleware");
const {
  getMySettings,
  updateMySettings,
} = require("../controllers/settingscontroller");

router.get("/me", auth, getMySettings);
router.put("/me", auth, updateMySettings);

module.exports = router;
