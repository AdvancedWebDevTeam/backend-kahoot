const service = require("./presentationService");

async function update(req, res) {
  const { id } = req.params;
  const { name } = req.body;

  const presentationExists = await service.existsPresentation(id);
  if(!presentationExists) {
    res.status(400).json({ message: "Presentation not found" });
  } else {
    const updatedPresentation = await service.updatePresentation(id, name);
    res.status(200).json(updatedPresentation);
  }
}

module.exports = {
  update
};
