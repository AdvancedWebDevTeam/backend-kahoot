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

async function getSpecificGroup(id) {
  return models.kahoot_groups.findOne({
    where: {
      groups_id: id
    }
  });
}

async function getAllUsersInGroup(groupId) {
  const usersId = await models.roles_groups_users.findAll({
    attributes: ["users_id"],
    where: {
      groups_id: groupId
    }
  });
  const userIdArray = usersId.map((model) => model.users_id);

  return models.users.findAll({
    attributes: ["users_name", "email"],
    where: {
      users_id: userIdArray
    }
  });
}

module.exports = {
  createNewGroup,
  getGroupsInDB,
  getSpecificGroup,
  getAllUsersInGroup
};
