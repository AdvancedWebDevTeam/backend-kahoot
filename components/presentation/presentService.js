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
        attributes: ["users_name", "users_id"],
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

exports.addChatPresent = async (data) => {
  await sequelize
    .query("call sp_addidmessagechatbox()", {})
    .then((v) => console.log(v));
  const chatbox = await models.messagechatbox.findOne({
    where: { presents_id: null },
    raw: true
  });
  const boxId = chatbox.messagechatbox_id;
  const row = await models.messagechatbox.update(
    {
      presents_id: data.presents_id,
      users_id: data.users_id,
      content: data.content
    },
    {
      where: {
        messagechatbox_id: boxId
      }
    }
  );

  return row > 0;
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
  await models.slide_present
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
  await models.messagechatbox.update(
    {
      presents_id: null
    },
    {
      where: {
        presents_id: presentID
      }
    }
  );
  await models.questions
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
  await models.collaborators
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

exports.addSlidePresent = async (presents_id, index_slide) => {
  const element = await models.slide_present.findOne({
    where: {
      presents_id
    }
  });
  if (!element) {
    await models.slide_present
      .create({
        presents_id,
        index_slide
      })
      .then(function () {
        return 1;
      })
      .catch((err) => {
        console.log(err);
        return -1;
      });
  } else {
    await models.slide_present
      .update(
        {
          index_slide
        },
        {
          where: {
            presents_id
          }
        }
      )
      .then(function () {
        return 1;
      })
      .catch((err) => {
        console.log(err);
        return -1;
      });
  }
};

exports.findOneChat = async (data) => {
  const chat = await models.messagechatbox.findAll({
    where: { presents_id: data },
    raw: true
  });
  const result = [];
  for (let i = 0; i < chat.length; i++) {
    const user = await models.users.findOne({
      where: { users_id: chat[i].users_id },
      raw: true
    });
    result.push({
      author: chat[i].users_id,
      name: user.users_name,
      chat: chat[i].content
    });
  }
  return result;
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
