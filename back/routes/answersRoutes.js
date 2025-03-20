const express = require("express");
const router = express.Router();
const {} = require("../controllers/answerControllers");
const {
  submitAnswer,
  updateCompletionsCount,
} = require("../controllers/answerControllers");

router.post("/submit", submitAnswer);
router.post("/updateCompletions", updateCompletionsCount);

module.exports = router;
