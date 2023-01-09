const express = require("express");
const router = express.Router();

const slideController = require("./slideController");

router.get("/show/:presentId", slideController.getAllSlideInPresent);
router.get("/history/:slideId", slideController.getSubmitContent);
router.get("/creator/:presentId", slideController.getNameAndCreator);
router.get("/index/:presentID", slideController.getSlidePresent);
router.post("/add", slideController.addSlideInPresentation);
router.get("/type", slideController.getSlideTypes);
router.patch("/edit", slideController.updateSlide);
router.post("/submit/:presentId/:slidesId", slideController.submitSlide);
router.delete("/delete/:slidesId", slideController.deleteSlide);

module.exports = router;