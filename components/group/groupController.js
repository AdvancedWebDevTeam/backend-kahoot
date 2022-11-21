const groupService = require("./groupService");
const roleService = require("../roles/rolesService");

function assignRoleInGroup() {}

function getSpecificUserInGroup() {}

function getUsersInGroup() {}

function getGroupDetails() {}

async function getListOfGroups(_, res) {
  const groups = await groupService.getGroupsInDB();
  res.status(200).json(groups);
}

async function createGroup(req, res) {
  try {
    const { groupName, userId } = req.body;
    const newGroup = await groupService.createNewGroup(groupName, userId);
    await roleService.assignNewRoleInGroup(newGroup.groups_id, userId, 1);

    res.status(200).json(newGroup);
  } catch (err) {
    const status = err.cause === "server" ? 500 : 400;
    res.status(status).json({ message: err.message });
  }
}

module.exports = {
  createGroup,
  getListOfGroups,
  getGroupDetails,
  getUsersInGroup,
  getSpecificUserInGroup,
  assignRoleInGroup
};
