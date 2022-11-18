const express = require("express");
const router = express.Router();
const passport = require("./passport");
const authController = require("./authController");
require("dotenv").config();

router.post("/login", passport.authenticate("local", {session: false}), authController.login)

router.get("/profile", passport.authenticate("jwt", {session: false}), authController.getProfile)

router.get("/login/google",
  passport.authenticate("google", { scope:
      [ "email", "profile" ], session: false }
));

router.get("/login/google/callback", passport.authenticate( "google", { 
    session: false,
    failureRedirect: `${process.env.BASE_URL}/login/google/failure`
}), authController.loginGoogle);

module.exports = router;