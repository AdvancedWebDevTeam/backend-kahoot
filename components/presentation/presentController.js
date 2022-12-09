const presentService = require("./presentService");
const rolesService = require("../roles/rolesService");

exports.getUserRoleInGroup = async (req, res) => {
    const { groupId, userId } = req.params;

    const result = await rolesService.getUserRoleInGroup(groupId, userId);

    res.status(200).json(result);
}

exports.getPresentation = async(req, res) => {
    const { groupId } = req.params;

    const presentations = await presentService.getPresentation(groupId);

    res.status(200).json(presentations);
}

exports.addPresentation = async(req, res) => {
    const { groupId, userId, presentName } = req.body;
    const result = await presentService.addPresentation(groupId, userId, presentName);
    if(result){
        res.status(201).send("Add presentation Successfully");
    }
    else{
        res.status(405).send("Failed to Add presentation")
    }
}