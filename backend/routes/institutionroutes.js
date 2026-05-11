const express = require("express");
const router = express.Router();
const auth = require("../middelwares/authmiddleware");
const {
  createInstitution,
  getAllInstitutions,
  deleteInstitution,
  toggleInstitutionStatus,
} = require("../controllers/institutioncontroller");

// ADMIN PROTECTED
router.post("/", auth, createInstitution);
router.get("/", auth, getAllInstitutions);
router.delete("/:id", auth, deleteInstitution);
router.patch("/:id/status", auth, toggleInstitutionStatus);

module.exports = router;
