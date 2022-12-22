const { where } = require("sequelize");
const { models } = require("../../models");
const { sequelize } = require("../../models/index");

const { presentations } = models;

exports.getPresentation = async (groupId) => {
  const result = await models.presentations.findAll({
    attributes: ["presents_id", "presents_name"],
    include: [
      {
        model: models.users,
        as: "user",
        attributes: ["users_name"],
        required: true
      }
    ],
    where: { groups_id: groupId, is_deleted: false },
    raw: true
  });

  return result;
};

exports.getMyPresentation = async (userId) => {
  const userPresent = await models.presentations.findAll({
    attributes: ["presents_id", "presents_name"],
    include: [
      {
        model: models.users,
        as: "user",
        attributes: ["users_name"],
        required: true
      }
    ],
    where: { creators_id: userId, is_deleted: false },
    raw: true
  });
  const userCollaboratorPresent = await models.collaborators.findAll({
    include: [
      {
        model: models.users,
        as: "user",
        attributes: ["users_name"],
        required: true,
      },
      {
        model: models.presentations,
        as: "present",
        attributes: [],
        where: { is_deleted: false},
        required: true
      }
    ],
    attributes: ["presents_id", [sequelize.literal("`present`.`presents_name`"), "presents_name"]],

    where: { users_id: userId },
    raw: true
  });

  console.log("---------------------Chay vao lan thu nnnn---------------------jdsdsd")
  const result = userPresent.push(userCollaboratorPresent);

  return result;
};

exports.addPresentation = async (groupId, userId, presentName) => {
  await sequelize
    .query("call sp_addidpresent()", {})
    .then((v) => console.log(v));

  const present = await models.presentations.findOne({
    attributes: ["presents_id"],
    where: { groups_id: null },
    raw: true
  });

  const presentID = present.presents_id;
  const succesfullRows = await models.presentations.update(
    {
      groups_id: groupId,
      creators_id: userId,
      presents_name: presentName,
      is_deleted: false
    },
    {
      where: { presents_id: presentID }
    }
  );
  return succesfullRows > 0;
};

exports.findOne = async (field) => {
  return presentations.findOne({
    where: field
  });
};

exports.updatePresentation = async (presentation, field) => {
  presentation.set(field);
  await presentation.save();
  return presentation;
};

exports.deletePresentation = async (presentID) => {
  await models.slides.destroy({
    where: {
      presents_id: presentID
    }
  }).then(function(rowDeleted) {
    console.log(rowDeleted);
  }, function(error) {
    console.log(error);
    return -1;
  });
  await models.presentations.destroy({
    where: {
      presents_id: presentID
    }
  }).then(function(rowDeleted) {
    return rowDeleted;
  }, function(error) {
    console.log(error);
    return -1;
  });
};
