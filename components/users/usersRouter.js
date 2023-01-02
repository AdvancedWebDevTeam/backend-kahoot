const express = require("express");

const router = express.Router();
const usersController = require("./usersController");

/* GET users listing. */
router.get("/all", usersController.getAllUsers);

router.get("/", usersController.getUser);
router.post("/", usersController.registerUser);

router.get("/:id", usersController.getUserProfile);

router.get("/:id/:value", usersController.checkPassword);

router.put("/update", usersController.updateUserProfile);

router.get("/:id/verify/:token", usersController.updateVerify);

router.post("/enteremail", usersController.createResetPasswordToken);
router.patch("/resetpassword", usersController.updatePassword);

module.exports = router;
