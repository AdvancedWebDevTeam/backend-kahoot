const express = require("express");

const router = express.Router();
const rolesController = require("./rolesController");

router.put("/", rolesController.assignRoleInGroup);

router.put("/:groupId/:userId", rolesController.joinGroupByLink);

module.exports = router;
