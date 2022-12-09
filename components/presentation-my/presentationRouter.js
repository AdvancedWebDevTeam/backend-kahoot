const express = require("express");

const router = express.Router();
const rolesController = require("./presentationController");

router.put("/:id/update", rolesController.update);

module.exports = router;
