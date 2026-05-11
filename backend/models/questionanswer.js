const mongoose = require("mongoose");

const QuestionAnswerSchema =
new mongoose.Schema({

  subject: String,

  semester: String,

  examType: String,

  question: String,

  modelAnswer: String,

  keywords: [String],

  marks: Number,

  uploadedBy: {

    type:
    mongoose.Schema.Types.ObjectId,

    ref: "users"
  }

}, {
  timestamps: true
});

module.exports =
mongoose.model(
  "questionanswers",
  QuestionAnswerSchema
);