const express = require("express");
const router = express.Router();
const {
  getQuestionnaires,
  getQuestionnaireById,
} = require("../controllers/questionnairesController");

router.get("/questionnaires", getQuestionnaires);

router.get("/questionnaire/:q_id", getQuestionnaireById);

module.exports = router;
