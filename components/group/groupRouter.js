const express = require("express");

const router = express.Router();
const groupController = require("./groupController");

router.post("/create", groupController.createGroup);

router.get("/all", groupController.getListOfGroups);
router.get("/:id", groupController.getGroupDetails);

router.get("/:groupId/users", groupController.getUsersInGroup);
router.get("/:groupId/users/:userId", groupController.getSpecificUserInGroup);

router.get("/user/:userId", groupController.getGroupsOfUser);

module.exports = router;
