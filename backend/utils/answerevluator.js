function evaluateAnswer(

  studentAnswer,

  keywords,

  totalMarks

) {

  let matched = 0;

  let matchedWords = [];

  const text =
  studentAnswer.toLowerCase();

  keywords.forEach((word) => {

    if (
      text.includes(
        word.toLowerCase()
      )
    ) {

      matched++;

      matchedWords.push(word);
    }
  });

  const percentage =
  (matched / keywords.length) * 100;

  const score =
  (
    percentage / 100
  ) * totalMarks;

  return {

    matchedKeywords:
    matchedWords,

    totalKeywords:
    keywords.length,

    percentage:
    Math.round(percentage),

    score:
    Number(score.toFixed(2))
  };
}

module.exports =
evaluateAnswer;