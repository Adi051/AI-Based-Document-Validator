const express = require("express");

const router = express.Router();

const QuestionAnswer =
require("../models/questionanswer");

const authMiddleware =
require("../middelwares/authmiddleware");


// ================= ADD MODEL ANSWER =================

router.post(

  "/add-answer",

  authMiddleware,

  async (req, res) => {

    try {

      if (
        req.user.role !==
        "Super Admin"
      ) {

        return res.status(403).json({

          success: false,

          message:
          "Only Super Admin"
        });
      }

      const data =
      await QuestionAnswer.create({

        subject:
        req.body.subject,

        semester:
        req.body.semester,

        examType:
        req.body.examType,

        question:
        req.body.question,

        modelAnswer:
        req.body.modelAnswer,

        keywords:
        req.body.keywords,

        marks:
        req.body.marks,

        uploadedBy:
        req.user.id
      });

      res.json({

        success: true,

        data
      });

    } catch (err) {

      res.status(500).json({

        success: false,

        message: err.message
      });
    }
  }
);

module.exports = router;