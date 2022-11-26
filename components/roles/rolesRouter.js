const express = require("express");

const router = express.Router();
const rolesController = require("./rolesController");

router.put("/assign", rolesController.assignRoleInGroup);
router.get("/all", rolesController.getAllRoles);
router.put("/:groupId/:userId", rolesController.joinGroupByLink);

module.exports = router;
