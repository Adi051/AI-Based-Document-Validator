const express = require("express");
const router = express.Router();
const auth = require("../middelwares/authmiddleware");

const {
  adminCreateUser,
  getAllUsers,
  deleteUser, // 👈 ADD
} = require("../controllers/usercontroller");

router.post("/admin-create", auth, adminCreateUser);
router.get("/", auth, getAllUsers);

// 🔥 DELETE USER
router.delete("/:id", auth, deleteUser);

module.exports = router;
