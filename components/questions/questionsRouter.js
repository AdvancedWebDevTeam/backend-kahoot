const express = require("express");
const questionsController = require("./questionsController");

const router = express.Router();

router.get("/:presentId", questionsController.getQuestionsOfPresentation);
router.put(
  "/:presentId/update",
  questionsController.updateQuestionsOfPresentation
);

module.exports = router;
