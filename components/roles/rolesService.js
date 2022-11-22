const { models, sequelize } = require("../../models");

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
    },
    raw: true
  });
}

async function queryUpdateRoleInGroup(groupId, userId, roleId) {
  return sequelize.query(
    `UPDATE roles_groups_users SET roles_id = ${roleId} WHERE groups_id = "${groupId}" AND users_id = "${userId}"`
  );
}

async function updateRoleInGroup(
  groupId,
  userId,
  roleId,
  createNewIfNotExists
) {
  const userRoleInGroup = await getUserRoleInGroup(groupId, userId);

  if (userRoleInGroup !== null) {
    // TODO: remove raw query if possible
    await queryUpdateRoleInGroup(groupId, userId, roleId);
    userRoleInGroup.roles_id = roleId;
    return userRoleInGroup;
  }

  if (createNewIfNotExists) {
    return assignNewRoleInGroup(groupId, userId, roleId);
  }
  throw new Error("User does not have a role in group", { cause: "client" });
}

async function joinGrByLink(groupId, userId) {
  const userRoleInGroup = await getUserRoleInGroup(groupId, userId);

  if (userRoleInGroup === null) {
    // TODO: remove raw query if possible
    await queryUpdateRoleInGroup(groupId, userId, 3);
    userRoleInGroup.roles_id = 3;
    return userRoleInGroup;
  }
  return userRoleInGroup;
}

module.exports = {
  assignNewRoleInGroup,
  existsRoleOfId,
  updateRoleInGroup,
  joinGrByLink
};
