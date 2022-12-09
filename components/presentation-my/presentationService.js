const { models } = require("../../models");
// TODO: change model name to presentation
const { kahoot_groups: presentationModel } = models;

async function existsPresentation(id) {
  const presentation = await presentationModel.findOne({
    where: { id }
  });
  return presentation !== null;
}

async function updatePresentation(id, name) {
  const presentation = await presentationModel.findOne({
    where: { id }
  });
  presentation.name = name;
  return presentation.save();
}

module.exports = {
  existsPresentation,
  updatePresentation
};
