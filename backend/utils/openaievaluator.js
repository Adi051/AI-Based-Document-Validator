const axios = require("axios");

async function openaiEvaluate(

  studentAnswer,

  modelAnswer,

  totalMarks

) {

  try {

    const response =
    await axios.post(

      "https://api.openai.com/v1/chat/completions",

      {

        model: "gpt-3.5-turbo",

        messages: [

          {
            role: "system",

            content:
            `
You are an AI exam evaluator.

Compare the student's answer with the model answer.

Return ONLY valid JSON:

{
  "score": number,
  "percentage": number,
  "feedback": "string"
}

Rules:
- score should be out of total marks
- percentage should be between 0-100
- feedback should be short
`
          },

          {
            role: "user",

            content:
            `
MODEL ANSWER:
${modelAnswer}

STUDENT ANSWER:
${studentAnswer}

TOTAL MARKS:
${totalMarks}
`
          }
        ],

        temperature: 0.3
      },

      {

        headers: {

          Authorization:
          `Bearer ${process.env.OPENAI_API_KEY}`,

          "Content-Type":
          "application/json"
        }
      }
    );

    const aiText =
    response.data
    .choices[0]
    .message.content;

    return JSON.parse(aiText);

  } catch (err) {

    console.log(
      "OPENAI ERROR:",
      err.response?.data ||
      err.message
    );

    return {

      score: 0,

      percentage: 0,

      feedback:
      "AI evaluation failed"
    };
  }
}

module.exports =
openaiEvaluate;