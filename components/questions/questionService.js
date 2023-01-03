const { Sequelize } = require("sequelize");
const { models } = require("../../models");

const questionsModel = models.questions;

exports.getQuestionsOfPresentation = async (id) => {
  return questionsModel.findAll({
    attributes: [
      [Sequelize.col("user.users_id"), "questionerId"],
      [Sequelize.col("user.users_name"), "questionerName"],
      [Sequelize.col("user.email"), "questionerEmail"],
      "questions_id",
      "content",
      "questions_time",
      "is_answer",
      "vote",
      "presents_id"
    ],
    include: [
      {
        model: models.users,
        as: "user",
        attributes: []
      }
    ],
    where: {
      presents_id: id
    },
    raw: true
  });
};
