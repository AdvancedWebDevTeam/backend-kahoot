const express = require("express");
const router = express.Router();

const slideController = require("./slideController");

router.get("/show/:presentId", slideController.getAllSlideInPresent);
router.get("/creator/:presentId", slideController.getNameAndCreator);
router.post("/add", slideController.addSlideInPresentation);
router.get("/type", slideController.getSlideTypes);

module.exports = router;