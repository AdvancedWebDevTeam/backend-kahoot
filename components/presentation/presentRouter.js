const express = require("express");
const router = express.Router();

const presentController = require("./presentController");

router.get("/:groupId", presentController.getPresentation);
router.get("/:groupId/role/:userId", presentController.getUserRoleInGroup);
router.post("/add", presentController.addPresentation);

module.exports = router;