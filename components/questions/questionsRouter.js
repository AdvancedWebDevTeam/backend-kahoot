const express = require("express");
const questionsController = require("./questionsController");

const router = express.Router();

router.get("/:presentId", questionsController.getQuestionsOfPresentation);

module.exports = router;
