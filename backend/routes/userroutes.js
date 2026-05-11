const express = require("express");
const router = express.Router();
const auth = require("../middelwares/authmiddleware");

const {
  adminCreateUser,
  getAllUsers,
  deleteUser,
  deleteMyAccount,
} = require("../controllers/usercontroller");

// GET all users
router.get("/", auth, getAllUsers);

// ADMIN create user
router.post("/admin-create", auth, adminCreateUser);

// 🔥 IMPORTANT: delete-me MUST come BEFORE :id
router.delete("/delete-me", auth, deleteMyAccount);

// DELETE USER (ADMIN)
router.delete("/:id", auth, deleteUser);

module.exports = router;