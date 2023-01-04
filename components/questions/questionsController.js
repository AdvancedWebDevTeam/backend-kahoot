const questionsService = require("./questionService");

exports.getQuestionsOfPresentation = async (req, res) => {
  const { presentId } = req.params;
  try {
    const questions = await questionsService.getQuestionsOfPresentation(
      presentId
    );
    res.status(200).send(questions);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.updateQuestionsOfPresentation = async (req, res) => {
  const { presentId } = req.params;
  const { questions } = req.body;
  try {
    const formattedQuestions = questions.map((question) => ({
      presents_id: presentId,
      users_id: question.questionerId,
      ...question
    }));

    const result = await questionsService.updateQuestionsOfPresentation(
      presentId,
      formattedQuestions
    );
    res.status(200).send(result);
  } catch (err) {
    res.status(400).send(err);
  }
};
