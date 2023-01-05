const { Sequelize } = require("sequelize");
const { models, sequelize } = require("../../models");

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
    order: [["questions_time", "DESC"]],
    raw: true
  });
};

exports.updateQuestionsOfPresentation = async (presentId, questions) => {
  const transaction = await sequelize.transaction();
  try {
    await questionsModel.destroy({
      where: {
        presents_id: presentId
      },
      transaction
    });
    await questionsModel.bulkCreate(questions, { transaction });
    await transaction.commit();
    return true;
  } catch (err) {
    await transaction.rollback();
    return false;
  }
};
