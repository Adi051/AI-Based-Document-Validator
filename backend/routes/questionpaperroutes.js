const express = require("express");

const router = express.Router();

const multer = require("multer");

const path = require("path");

const { exec } = require("child_process");

const QuestionPaper =
require("../models/questionpaper");

const extractQuestions =
require("../utils/questionExtractor");

const authMiddleware =
require("../middelwares/authmiddleware");

const {
  checkQuestionPaper
} = require("../utils/keywordchecker");


// ================= MULTER =================

const storage = multer.diskStorage({

  destination: (req, file, cb) => {

    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {

    cb(
      null,
      Date.now() +
      path.extname(file.originalname)
    );
  }
});

const upload = multer({ storage });


// ================= UPLOAD =================

router.post(

  "/upload-question-paper",

  authMiddleware,

  upload.single("file"),

  async (req, res) => {

    try {

      // ================= SUPER ADMIN =================

      if (
        req.user.role !== "Super Admin"
      ) {

        return res.status(403).json({

          success: false,

          message:
          "Only Super Admin allowed"
        });
      }

      const filePath =
      path.join(
        __dirname,
        "..",
        req.file.path
      );

      console.log(
        "FILE PATH:",
        filePath
      );


      router.post(

  "/validate-question-paper",

  authMiddleware,

  upload.single("file"),

  async (req, res) => {

    try {

      const filePath = path.join(
        __dirname,
        "..",
        req.file.path
      );

      const pythonCommand =
      `python ocr-services/questionpaper-ocr.py "${filePath}"`;

      exec(

        pythonCommand,

        async (error, stdout) => {

          if (error) {

            return res.status(500).json({

              success: false,

              message:
              "OCR failed"
            });
          }

          const rawText = stdout;

          console.log(
            "OCR OUTPUT:\n",
            rawText
          );

          // extract uploaded questions

          const studentQuestions =
          extractQuestions(rawText);

          console.log(
            "STUDENT QUESTIONS:\n",
            studentQuestions
          );

          // find original paper

          const originalPaper =
          await QuestionPaper.findOne({

            subject:
            req.body.subject,

            semester:
            req.body.semester,

            examType:
            req.body.examType,

            isOriginal: true
          });

          if (!originalPaper) {

            return res.status(404).json({

              success: false,

              message:
              "Original paper not found"
            });
          }

          // compare

          const result =
          checkQuestionPaper(

            studentQuestions,

            originalPaper.extractedQuestions
          );

          res.json({

            success: true,

            result,

            studentQuestions,

            originalQuestions:
            originalPaper.extractedQuestions
          });
        }
      );

    } catch (err) {

      res.status(500).json({

        success: false,

        message: err.message
      });
    }
  }
);

      // ================= OCR =================

      const pythonCommand =
      `python ocr-services/questionpaper-ocr.py "${filePath}"`;

      exec(

        pythonCommand,

        async (
          error,
          stdout,
          stderr
        ) => {

          if (error) {

            console.log(
              "OCR ERROR:",
              error
            );

            return res.status(500).json({

              success: false,

              message:
              "OCR failed"
            });
          }

          const rawText =
          stdout.toString();

          console.log(
            "OCR OUTPUT:"
          );

          console.log(rawText);

          // ================= QUESTIONS =================

          const questions =
          extractQuestions(rawText);

          console.log(
            "EXTRACTED QUESTIONS:"
          );

          console.log(questions);

          // ================= SAVE =================

          const paper =
          await QuestionPaper.create({

            documentType:
            "question_paper",

            subject:
            req.body.subject,

            semester:
            req.body.semester,

            examType:
            req.body.examType,

            totalMarks:
            req.body.totalMarks,

            extractedQuestions:
            questions,

            uploadedBy:
            req.user.id
          });

          res.json({

            success: true,

            message:
            "Question paper uploaded",

            questions,

            paper
          });
        }
      );

    } catch (err) {

      console.log(err);

      res.status(500).json({

        success: false,

        message: err.message
      });
    }
  }
);

router.post(

  "/validate-question-paper",

  authMiddleware,

  upload.single("file"),

  async (req, res) => {

    try {

      const filePath = path.join(
        __dirname,
        "..",
        req.file.path
      );

      const pythonCommand =
      `python ocr-services/questionpaper-ocr.py "${filePath}"`;

      exec(

        pythonCommand,

        async (error, stdout) => {

          if (error) {

            return res.status(500).json({

              success: false,

              message:
              "OCR failed"
            });
          }

          const rawText = stdout;

          console.log(
            "OCR OUTPUT:\n",
            rawText
          );

          // extract uploaded questions

          const studentQuestions =
          extractQuestions(rawText);

          console.log(
            "STUDENT QUESTIONS:\n",
            studentQuestions
          );

          // find original paper

          const originalPaper =
          await QuestionPaper.findOne({

            subject:
            req.body.subject,

            semester:
            req.body.semester,

            examType:
            req.body.examType,

            isOriginal: true
          });

          if (!originalPaper) {

            return res.status(404).json({

              success: false,

              message:
              "Original paper not found"
            });
          }

          // compare

          const result =
          checkQuestionPaper(

            studentQuestions,

            originalPaper.extractedQuestions
          );

          res.json({

            success: true,

            result,

            studentQuestions,

            originalQuestions:
            originalPaper.extractedQuestions
          });
        }
      );

    } catch (err) {

      res.status(500).json({

        success: false,

        message: err.message
      });
    }
  }
);

module.exports = router;