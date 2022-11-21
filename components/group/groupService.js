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

module.exports = {
  createNewGroup,
  getGroupsInDB,
  getSpecificGroup
};
