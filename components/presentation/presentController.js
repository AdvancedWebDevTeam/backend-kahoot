const presentService = require("./presentService");
const rolesService = require("../roles/rolesService");

exports.getUserRoleInGroup = async (req, res) => {
  const { groupId, userId } = req.params;

  const result = await rolesService.getUserRoleInGroup(groupId, userId);

  res.status(200).json(result);
};

exports.getPresentation = async (req, res) => {
  const { groupId } = req.params;

  const presentations = await presentService.getPresentation(groupId);

  res.status(200).json(presentations);
};

exports.addPresentation = async (req, res) => {
  const { groupId, userId, presentName } = req.body;
  const result = await presentService.addPresentation(
    groupId,
    userId,
    presentName
  );
  if (result) {
    res.status(201).send("Add presentation Successfully");
  } else {
    res.status(405).send("Failed to Add presentation");
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const presentation = await presentService.findOne({ presents_id: id });
  if (presentation == null) {
    res.status(400).json({ message: "Presentation not found" });
  } else {
    const updatedPresentation = await presentService.updatePresentation(
      presentation,
      { presents_name: name }
    );
    res.status(200).json(updatedPresentation);
  }
};

exports.deletePresentation = async (req, res) => {
  const { presentID } = req.params;
  const result = await presentService.deletePresentation(presentID);
  if (result === -1) {
    res.json("Failed to delete presentation!");
  } else {
    res.json("Successfully deleted!");
  }
};
