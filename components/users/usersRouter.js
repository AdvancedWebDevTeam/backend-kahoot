const express = require("express");

const router = express.Router();
const usersController = require("./usersController");

/* GET users listing. */
router.get("/", usersController.getUser);

router.post("/", usersController.registerUser);

router.get("/:id", usersController.getUserProfile);

router.get("/:id/verify/:token", usersController.updateVerify);

module.exports = router;
