const express = require("express");

const router = express.Router();
const groupController = require("./groupController");

router.post("/", groupController.createGroup);

router.get("/", groupController.getListOfGroups);
router.get("/:id", groupController.getGroupDetails);

router.get("/:groupId/users", groupController.getUsersInGroup);
router.get("/:groupId/users/:userId", groupController.getSpecificUserInGroup);

module.exports = router;
