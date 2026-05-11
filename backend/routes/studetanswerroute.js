const express = require("express");

const router = express.Router();

const multer = require("multer");

const path = require("path");

const { exec } =
require("child_process");

const ModelAnswer =
require("../models/questionanswer");

const authMiddleware =
require("../middelwares/authmiddleware");

const extractQuestions =
require("../utils/questionExtractor");

const evaluateAnswer =
require("../utils/answerevluator");


// ================= MULTER =================

const storage =
multer.diskStorage({

  destination:
  (req, file, cb) => {

    cb(null, "uploads/");
  },

  filename:
  (req, file, cb) => {

    cb(
      null,
      Date.now() +
      path.extname(
        file.originalname
      )
    );
  }
});

const upload =
multer({ storage });


// ================= ROUTE =================

router.post(

  "/upload-answer-sheet",

  authMiddleware,

  upload.single("file"),

  async (req, res) => {

    try {

      const filePath =
      path.join(
        __dirname,
        "..",
        req.file.path
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

            console.log(error);

            return res
            .status(500)
            .json({

              success: false,

              message:
              "OCR failed"
            });
          }

          // ================= OCR TEXT =================

          const rawText =
          stdout;

          console.log(
            "OCR OUTPUT:\n",
            rawText
          );

          // ================= EXTRACT ANSWERS =================

          const studentAnswers =
          extractQuestions(rawText);

          console.log(
            "STUDENT ANSWERS:\n",
            studentAnswers
          );

          // ================= GET MODEL ANSWERS =================

          const answers =
          await ModelAnswer.find({

            subject:
            String(req.body.subject).trim(),

            semester:
            String(req.body.semester).trim(),

            examType:
            String(req.body.examType).trim()
          });

          console.log(
            "FOUND MODEL ANSWERS:",
            answers.length
          );

          let results = [];

          // ================= LOOP =================

          for (
            let i = 0;
            i < answers.length;
            i++
          ) {

            const model =
            answers[i];

            const student =
            studentAnswers[i];

            // no answer found

            if (!student) {

              results.push({

                question:
                model.question,

                score: 0,

                percentage: 0,

                matchedKeywords: [],

                totalKeywords:
                model.keywords.length,

                message:
                "Answer not found"
              });

              continue;
            }

            // ================= EVALUATION =================

            const evaluation =
            evaluateAnswer(

              student.answer,

              model.keywords,

              model.marks
            );

            results.push({

              question:
              model.question,

              studentQuestion:
              student.question,

              studentAnswer:
              student.answer,

              score:
              evaluation.score,

              percentage:
              evaluation.percentage,

              matchedKeywords:
              evaluation.matchedKeywords,

              totalKeywords:
              evaluation.totalKeywords
            });
          }

          // ================= TOTAL SCORE =================

          let totalScore = 0;

          results.forEach((r) => {

            totalScore +=
            Number(r.score);
          });

          // ================= RESPONSE =================

          res.json({

            success: true,

            totalQuestions:
            results.length,

            totalScore:
            Number(
              totalScore.toFixed(2)
            ),

            results
          });
        }
      );

    } catch (err) {

      console.log(err);

      res.status(500).json({

        success: false,

        message:
        err.message
      });
    }
  }
);

module.exports =
router;