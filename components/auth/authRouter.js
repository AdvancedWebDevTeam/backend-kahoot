const express = require("express");
const router = express.Router();
const passport = require("./passport");
const authController = require("./authController");

router.post("/login", passport.authenticate("local", {session: false}), authController.login)

router.get("/profile", passport.authenticate("jwt", {session: false}), authController.getProfile)
module.exports = router;