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
  const query = `
    SELECT q.id AS question_id, q.question_text, q.question_type, 
           ac.id AS choice_id, ac.choice_text
    FROM questions q
    LEFT JOIN answer_choices ac ON q.id = ac.question_id
    WHERE q.questionnaire_id = ?;
  `;

  db.query(query, [req.params.id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const questions = {};

    results.forEach((row) => {
      if (!questions[row.question_id]) {
        questions[row.question_id] = {
          question_id: row.question_id,
          question_text: row.question_text,
          question_type: row.question_type,
          choices: [],
        };
      }
      if (row.choice_id) {
        questions[row.question_id].choices.push({
          id: row.choice_id,
          text: row.choice_text,
        });
      }
    });

    res.json({ questions: Object.values(questions) });
  });
};

module.exports = { getQuestionnaires, getQuestionnaireById };
