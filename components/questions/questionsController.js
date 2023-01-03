const { v4: uuidv4 } = require("uuid");
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
    const randomUUID = uuidv4();
    const formattedQuestions = questions.map((question) => ({
      questions_id: question.questions_id || randomUUID,
      presents_id: presentId,
      users_id: question.questionerId,
      questions_time: question.questions_time || new Date(),
      ...question
    }));

    const result = await questionsService.updateQuestionsOfPresentation(
      presentId,
      formattedQuestions
    );
    res.status(200).send(result);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
};
