const express = require("express");

const router = express.Router();
const usersController = require("./usersController");

/* GET users listing. */
router.get("/", usersController.getUser);

router.post("/", usersController.registerUser);

module.exports = router;
