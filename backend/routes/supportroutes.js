const express = require("express");
const router = express.Router();
const auth = require("../middelwares/authmiddleware");
const {
  createTicket,
  getMyTickets,
  getAllTickets,
  replyTicket,
} = require("../controllers/supportController");

// USER
router.post("/", auth, createTicket);
router.get("/me", auth, getMyTickets);

// ADMIN
router.get("/", auth, getAllTickets);
router.put("/:id/reply", auth, replyTicket);

module.exports = router;
