function cleanText(text) {

  return text
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, "")
    .trim();
}

function calculateSimilarity(studentQ, originalQ) {

  const s1 =
  cleanText(studentQ).split(" ");

  const s2 =
  cleanText(originalQ).split(" ");

  let matched = 0;

  for (let word of s1) {

    if (s2.includes(word)) {
      matched++;
    }
  }

  return Math.floor(
    (matched / s2.length) * 100
  );
}

function checkQuestionPaper(
  studentQuestions,
  originalQuestions
) {

  let matchedQuestions = 0;

  let totalSimilarity = 0;

  for (let student of studentQuestions) {

    for (let original of originalQuestions) {

      const similarity =
      calculateSimilarity(
        student.question,
        original.question
      );

      if (similarity >= 50) {

        matchedQuestions++;

        totalSimilarity += similarity;

        break;
      }
    }
  }

  const finalSimilarity =
  matchedQuestions > 0
    ? Math.floor(
        totalSimilarity /
        matchedQuestions
      )
    : 0;

  return {

    matchedQuestions,

    totalQuestions:
    originalQuestions.length,

    similarity:
    finalSimilarity,

    status:
      finalSimilarity >= 60
      ? "Authentic"
      : "Fake"
  };
}

module.exports = {
  calculateSimilarity,
  checkQuestionPaper
};