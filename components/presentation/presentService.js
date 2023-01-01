const { models } = require("../../models");
const { sequelize } = require("../../models/index");
const {
  findCollaboratorsOfPresentation
} = require("../collaborator/collaboratorService");

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

async function addListOfCollaborators(presentList) {
  const result = [...presentList];
  for (let i = 0; i < presentList.length; i++) {
    const collaboratorList = await findCollaboratorsOfPresentation(
      presentList[i].presents_id
    );
    result[i].collaborators = collaboratorList;
  }
  return result;
}

exports.getMyPresentation = async (userId) => {
  let userPresent = await models.presentations.findAll({
    attributes: ["presents_id", "presents_name", "groups_id"],
    include: [
      {
        model: models.users,
        as: "user",
        attributes: ["users_name", "users_id"],
        required: true
      }
    ],
    where: { creators_id: userId, is_deleted: false },
    raw: true
  });

  const userCollaboratorPresent = await models.presentations.findAll({
    include: [
      {
        model: models.users,
        as: "user",
        attributes: ["users_name", "users_id"]
      },
      {
        model: models.collaborators,
        as: "collaborators",
        where: { users_id: userId }
      }
    ],
    attributes: ["presents_id", "presents_name"],

    where: { is_deleted: false },
    raw: true
  });

  for (let i = 0; i < userCollaboratorPresent.length; i++) {
    userPresent.push(userCollaboratorPresent[i]);
  }
  userPresent = await addListOfCollaborators(userPresent);
  return userPresent;
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
  await models.slides
    .destroy({
      where: {
        presents_id: presentID
      }
    })
    .then(
      function (rowDeleted) {
        console.log(rowDeleted);
      },
      function (error) {
        console.log(error);
        return -1;
      }
    );
  await models.presentations
    .destroy({
      where: {
        presents_id: presentID
      }
    })
    .then(
      function (rowDeleted) {
        return rowDeleted;
      },
      function (error) {
        console.log(error);
        return -1;
      }
    );
};

async function deleteAllCollaboratorsOfPresentation(id) {
  const t = await sequelize.transaction();
  try {
    await models.collaborators.destroy({
      where: { presents_id: id },
      transaction: t
    });
    await t.commit();
  } catch (error) {
    await t.rollback();
    throw new Error("Error while deleting collaborators");
  }
}

async function addCollaboratorsToPresentation(id, collaborators) {
  const t = await sequelize.transaction();
  try {
    for (let i = 0; i < collaborators.length; i++) {
      await models.collaborators.create(
        {
          presents_id: id,
          users_id: collaborators[i].userId
        },
        { transaction: t }
      );
    }
    await t.commit();
  } catch (error) {
    await t.rollback();
    throw new Error("Error while adding collaborators");
  }
}

// TODO: check this function
exports.updateCollaborators = async (id, collaborators) => {
  const presentation = await models.presentations.findOne({
    where: { presents_id: id }
  });
  if (!presentation) {
    throw new Error("Presentation not found");
  }

  try {
    await deleteAllCollaboratorsOfPresentation(id);
    await addCollaboratorsToPresentation(id, collaborators);
  } catch (error) {
    throw new Error(error.message);
  }
};
