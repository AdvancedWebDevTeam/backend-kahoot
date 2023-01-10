const { Op } = require("sequelize");
const { models, sequelize } = require("../../models");
const {
  makeGroupPresentationPublic
} = require("../presentation/presentService");

async function isUserInGroup(groupId, userId) {
  const user = await models.roles_groups_users.findOne({
    where: {
      groups_id: groupId,
      users_id: userId
    }
  });
  return user !== null;
}

async function getNewGroupId() {
  const numOfGroups = await models.kahoot_groups.count();
  const paddedId = (numOfGroups + 1).toString().padStart(3, "0");
  return `gr${paddedId}`;
}

async function createNewGroup(groupName) {
  const newGroupId = await getNewGroupId();
  const newGroup = await models.kahoot_groups.create({
    groups_id: newGroupId,
    groups_name: groupName,
    is_deleted: false
  });

  if (newGroup instanceof models.kahoot_groups) {
    return newGroup;
  }
  throw new Error("Failed to create new group", { cause: "server" });
}

async function getGroupsInDB() {
  return models.kahoot_groups.findAll();
}

async function getGroupById(id) {
  return models.kahoot_groups.findOne({
    where: {
      groups_id: id
    }
  });
}

async function existsGroupOfId(groupId) {
  const group = await getGroupById(groupId);
  return group !== null;
}

async function getAllUsersInGroup(groupId) {
  const usersId = await models.roles_groups_users.findAll({
    where: {
      groups_id: groupId
    },
    include: ["role", "user"],
    raw: true
  });

  return usersId.map((model) => {
    return {
      userId: model.users_id,
      username: model["user.users_name"],
      email: model["user.email"],
      roleId: model.roles_id,
      roleName: model["role.roles_name"]
    };
  });
}

async function getGroupsOfUser(userId) {
  // get groupIds of groups that user is in
  const groupsId = await models.roles_groups_users.findAll({
    attributes: ["groups_id"],
    where: {
      users_id: userId
    },
    raw: true
  });
  const groupIdArray = groupsId.map((model) => model.groups_id);

  // from groupIds, get more info about each group
  return models.kahoot_groups.findAll({
    where: {
      groups_id: groupIdArray,
      is_deleted: false
    }
  });
}

async function getOwnerAndCoOwnersInGroup(groupId) {
  return models.roles_groups_users.findAll({
    attributes: [
      [sequelize.col("user.users_name"), "username"],
      [sequelize.col("user.users_id"), "userId"],
      [sequelize.col("user.email"), "roleName"]
    ],
    where: {
      groups_id: groupId,
      roles_id: { [Op.lte]: 2 }
    },
    include: [
      {
        model: models.users,
        as: "user",
        attributes: []
      }
    ]
  });
}

async function deleteGroup(id) {
  const group = await getGroupById(id);
  if (group) {
    await makeGroupPresentationPublic(id);

    group.is_deleted = true;
    await group.save();
    return true;
  }
  return false;
}

module.exports = {
  createNewGroup,
  getGroupsInDB,
  getGroupById,
  getAllUsersInGroup,
  existsGroupOfId,
  getGroupsOfUser,
  isUserInGroup,
  getOwnerAndCoOwnersInGroup,
  deleteGroup
};
