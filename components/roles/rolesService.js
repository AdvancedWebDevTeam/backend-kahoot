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

async function getRoleById(roleId) {
  return models.roles.findOne({
    where: {
      roles_id: roleId
    }
  });
}

async function existsRoleOfId(roleId) {
  const role = await getRoleById(roleId);
  return role !== null;
}

async function getUserRoleInGroup(groupId, userId) {
  return models.roles_groups_users.findOne({
    where: {
      groups_id: groupId,
      users_id: userId
    }
  });
}

async function updateRoleInGroup(
  groupId,
  userId,
  roleId,
  createNewIfNotExists
) {
  const userRoleInGroup = await models.roles_groups_users.findOne({
    where: {
      groups_id: groupId,
      users_id: userId
    }
  });

  if (userRoleInGroup !== null) {
    // TODO: Find solution, cannot update role yet bc roles_id is primary key
    userRoleInGroup.roles_id = roleId;
    await userRoleInGroup.save();
    return userRoleInGroup;
  }

  if (createNewIfNotExists) {
    return assignNewRoleInGroup(groupId, userId, roleId);
  }
  throw new Error("User does not have a role in group", { cause: "client" });
}

module.exports = {
  assignNewRoleInGroup,
  existsRoleOfId,
  updateRoleInGroup
};
