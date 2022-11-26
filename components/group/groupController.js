const groupService = require("./groupService");
const roleService = require("../roles/rolesService");

async function getSpecificUserInGroup(req, res) {
  const { groupId, userId } = req.params;
  const users = await groupService.getAllUsersInGroup(groupId);
  const user = users.find((u) => u.users_id === userId);

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
}

async function getUsersInGroup(req, res) {
  try{
    const { groupId } = req.params;
    const users = await groupService.getAllUsersInGroup(groupId);
    res.status(200).json(users);
  } catch (e) {
    const status = e.cause === "server" ? 500 : 400;
    res.status(status).json({ message: e.message });
  }
}

async function getGroupDetails(req, res) {
  const group = await groupService.getGroupById(req.params.id);
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
    const { groupName, userId, memberIds } = req.body;
    const newGroup = await groupService.createNewGroup(groupName, userId);
    await roleService.assignNewRoleInGroup(newGroup.groups_id, userId, 1);

    if (memberIds) {
      await roleService.assignRoleToMultipleUsersInGroup(
        newGroup.groups_id,
        memberIds,
        3
      );
    }
    res.status(200).json(newGroup);
  } catch (err) {
    const status = err.cause === "server" ? 500 : 400;
    res.status(status).json({ message: err.message });
  }
}

async function getGroupsOfUser(req, res) {
  const { userId } = req.params;

  try {
    const groups = await groupService.getGroupsOfUser(userId);
    res.status(200).json(groups);
  } catch (e) {
    const status = e.cause === "server" ? 500 : 400;
    res.status(status).json({ message: e.message });
  }
}

module.exports = {
  createGroup,
  getListOfGroups,
  getGroupDetails,
  getUsersInGroup,
  getSpecificUserInGroup,
  getGroupsOfUser
};
