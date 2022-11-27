const { getUserByID } = require("../users/usersService");
const { existsGroupOfId } = require("../group/groupService");
const {
  existsRoleOfId,
  updateRoleInGroup,
  joinGrByLink,
  getAllAvailableRoles
} = require("./rolesService");

async function allIdExist(groupId, userId, roleId) {
  const user = await getUserByID(userId);
  const groupExists = await existsGroupOfId(groupId);
  const roleExists = await existsRoleOfId(roleId);

  return user !== null && groupExists && roleExists;
}

async function assignRoleInGroup(req, res) {
  const { groupId, userId, roleId } = req.body;
  const createNewIfNotExists = req.body.createNewIfNotExists ?? false;

  try {
    const idsExist = await allIdExist(groupId, userId, roleId);
    if (!idsExist) {
      res.status(400).json({ message: "One or more valid ids are needed" });
    } else {
      const role = await updateRoleInGroup(
        groupId,
        userId,
        roleId,
        createNewIfNotExists
      );
      res.status(200).json(role);
    }
  } catch (err) {
    const status = err.cause === "server" ? 500 : 400;
    res.status(status).json({ message: err.message });
  }
}

async function joinGroupByLink(req, res) {
  const { groupId, userId } = req.params;

  try {
    const role = await joinGrByLink(groupId, userId);
    res.status(200).json(role);
  } catch (err) {
    const status = err.cause === "server" ? 500 : 400;
    res.status(status).json({ message: err.message });
  }
}

async function getAllRoles(_, res) {
  const roles = await getAllAvailableRoles();
  res.status(200).json(roles);
}

module.exports = {
  assignRoleInGroup,
  joinGroupByLink,
  getAllRoles
};
