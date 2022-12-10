const express = require("express");
const presentController = require("./presentController");

const router = express.Router();

router.put("/:id/update", presentController.update);
router.get("/:groupId", presentController.getPresentation);
router.get("/:groupId/role/:userId", presentController.getUserRoleInGroup);
router.post("/add", presentController.addPresentation);

module.exports = router;
