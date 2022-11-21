const { models } = require("../../models");

async function assignNewRoleInGroup(groupId, userId, roleId) {
  const assignRole = await models.roles_groups_users.create({
    groups_id: groupId,
    users_id: userId,
    roles_id: roleId
  });

  if (assignRole instanceof models.roles_groups_users) {
    return assignRole;
  }
  throw new Error("Failed to assign new role in group", { cause: "server" });
}

module.exports = {
  assignNewRoleInGroup
};
