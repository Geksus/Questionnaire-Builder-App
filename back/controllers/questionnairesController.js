const db = require("../../db");

const getQuestionnaires = (req, res) => {
  const query = "SELECT * FROM questionnaires";
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ questionnaires: results });
  });
};

const getQuestionnaireById = (req, res) => {
  const query = "SELECT * FROM questionnaires WHERE id = ?";

  db.query(query, [req.params.id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ questionnaire: results });
  });
};

module.exports = { getQuestionnaires, getQuestionnaireById };
