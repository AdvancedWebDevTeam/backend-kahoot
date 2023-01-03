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
