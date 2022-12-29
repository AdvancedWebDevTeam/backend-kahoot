const { raw } = require("express");
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
    attributes: ["presents_id", "presents_name", "groups_id"],
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
    attributes: [
      "presents_id", 
      [sequelize.literal("`present`.`presents_name`"), "presents_name"],
      [sequelize.literal("`present`.`groups_id`"), "groups_id"],
  ],

    where: { users_id: userId },
    raw: true
  });
  for(let i = 0; i < userCollaboratorPresent.length; i++){
    userPresent.push(userCollaboratorPresent[i]);
  }
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
    where: { presents_id: null},
    raw: true
  });
  const boxId = chatbox.messagechatbox_id;
  const row = await models.messagechatbox.update({
    presents_id: data.presents_id,
    users_id: data.users_id,
    content: data.content
  },
  {
    where: {
      messagechatbox_id: boxId
    }
  });

  return row > 0;
}

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
  await models.slide_present.destroy({
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

exports.addSlidePresent = async (presents_id, index_slide) => {
  const element = await models.slide_present.findOne({
    where: {
      presents_id
    }
  });
  if (!element) {
    await models.slide_present.create({
      presents_id,
      index_slide
    }).then(function(){
      return 1;
    }).catch(err => {
      console.log(err);
      return -1;
    });
  } else {
    await models.slide_present.update({
      index_slide
    },
    {
      where: {
        presents_id
      }
    }).then(function(){
      return 1;
    }).catch(err => {
      console.log(err);
      return -1;
    });
  }
};

exports.findOneChat = async(data) => {
  const chat =  await models.messagechatbox.findAll({
    where: {presents_id: data},
    raw: true
  });
  const result = [];
  for (let i = 0; i < chat.length; i++) {
    result.push({
      author: chat[i].users_id,
      chat: chat[i].content
    });
  }
  return result;
};

exports.addMessageToChat = async(data) => {
  return this.addChatPresent(data);
};