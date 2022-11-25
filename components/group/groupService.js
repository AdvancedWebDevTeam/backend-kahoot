const { models } = require("../../models");

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
  // get userIds of users in group
  const usersId = await models.roles_groups_users.findAll({
    attributes: ["users_id"],
    where: {
      groups_id: groupId
    },
    raw: true
  });
  const userIdArray = usersId.map((model) => model.users_id);

  // from userIds, get more info about each user
  return models.users.findAll({
    attributes: ["users_id", "users_name", "email"],
    where: {
      users_id: userIdArray
    }
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
      groups_id: groupIdArray
    }
  });
}

module.exports = {
  createNewGroup,
  getGroupsInDB,
  getGroupById,
  getAllUsersInGroup,
  existsGroupOfId,
  getGroupsOfUser
};
