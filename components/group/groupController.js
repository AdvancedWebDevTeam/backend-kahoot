const groupService = require("./groupService");
const roleService = require("../roles/rolesService");

function assignRoleInGroup() {}

function getSpecificUserInGroup() {}

async function getUsersInGroup(req, res) {
  const { groupId } = req.params;
  const users = await groupService.getAllUsersInGroup(groupId);
  res.status(200).json(users);
}

async function getGroupDetails(req, res) {
  const group = await groupService.getSpecificGroup(req.params.id);
  if (group) {
    res.status(200).json(group);
  } else {
    res.status(404).json({ message: "Group not found" });
  }
}

async function getListOfGroups(_, res) {
  const list = await groupService.getGroupsInDB();
  res.status(200).json(list);
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
