const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({

  qno: String,

  question: String,

  keywords: [String],

  marks: Number

});

const QuestionPaperSchema = new mongoose.Schema({

  documentType: {
    type: String,
    default: "question_paper"
  },

  subject: String,

  semester: String,

  examType: String,

  totalMarks: Number,

  extractedQuestions: [QuestionSchema],

  isOriginal: {
    type: Boolean,
    default: true
  },

  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users"
  }

}, {
  timestamps: true
});

module.exports =
mongoose.model(
  "QuestionPaper",
  QuestionPaperSchema
);