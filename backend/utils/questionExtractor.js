function extractQuestions(text) {

  const answers = [];

  // split using Q1. Q2. etc

  const parts =
  text.split(/Q\d+\./i);

  for (let i = 1; i < parts.length; i++) {

    const block =
    parts[i].trim();

    if (block.length < 20)
    continue;

    const lines =
    block.split("\n");

    // first line = question

    const question =
    lines[0]
      .trim();

    // remaining lines = answer

    const answer =
    lines
      .slice(1)
      .join(" ")
      .trim();

    answers.push({

      question,

      answer
    });
  }

  return answers;
}

module.exports =
extractQuestions;