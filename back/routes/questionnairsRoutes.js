const express = require("express");
const router = express.Router();
const getQuestionnairs = require("../controllers/questionnairesController");

router.get("/questionnairs", getQuestionnairs);

module.exports = router;
