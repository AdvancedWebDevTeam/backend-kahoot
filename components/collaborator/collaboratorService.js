const { models } = require("../../models");
const { Sequelize } = require("sequelize");

exports.findCollaboratorsOfPresentation = async (presentationId) => {
  return models.collaborators.findAll({
    attributes: [
      [Sequelize.col("user.users_name"), "username"],
      [Sequelize.col("user.users_id"), "userId"],
      [Sequelize.col("user.email"), "email"]
    ],
    include: [
      {
        model: models.users,
        as: "user",
        attributes: []
      }
    ],
    where: { presents_id: presentationId },
    raw: true
  });
};
