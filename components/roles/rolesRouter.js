const express = require("express");

const router = express.Router();
const rolesController = require("./rolesController");

router.put("/", rolesController.assignRoleInGroup);

module.exports = router;
