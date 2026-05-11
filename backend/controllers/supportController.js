const SupportTicket = require("../models/support");

// USER → CREATE TICKET
exports.createTicket = async (req, res) => {
  try {
    const ticket = await SupportTicket.create({
      user: req.userId,
      subject: req.body.subject,
      message: req.body.message,
      category: req.body.category,
    });

    res.status(201).json({ success: true, ticket });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// USER → MY TICKETS
exports.getMyTickets = async (req, res) => {
  const tickets = await SupportTicket.find({ user: req.userId })
    .sort({ createdAt: -1 });

  res.json(tickets);
};

// ADMIN → ALL TICKETS
exports.getAllTickets = async (req, res) => {
  const tickets = await SupportTicket.find()
    .populate("user", "name email")
    .populate("repliedBy", "name email")
    .sort({ createdAt: -1 });

  res.json(tickets);
};

// ADMIN → REPLY / UPDATE STATUS
exports.replyTicket = async (req, res) => {
  const ticket = await SupportTicket.findById(req.params.id);

  if (!ticket) {
    return res.status(404).json({ message: "Ticket not found" });
  }

  ticket.adminReply = req.body.adminReply;
  ticket.status = req.body.status || "In Progress";
  ticket.repliedBy = req.userId;

  await ticket.save();

  res.json({ success: true, ticket });
};
