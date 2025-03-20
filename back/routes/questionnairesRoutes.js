const express = require("express");
const router = express.Router();
const {
  getQuestionnaires,
  getQuestionnaireById,
} = require("../controllers/questionnairesController");
const { submitAnswer } = require("../controllers/answerControllers");

router.get("/questionnaires", getQuestionnaires);
router.get("/questionnaire/:id", getQuestionnaireById);
router.post("/submit", submitAnswer);

module.exports = router;
