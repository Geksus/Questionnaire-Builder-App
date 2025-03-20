const db = require("../../db");

const submitAnswer = (req, res) => {
  const { session_id, questionnaire_id, question_id, answers } = req.body;

  if (!session_id || !questionnaire_id || !question_id || !answers) {
    return res.status(400).json({
      error:
        "Missing required fields: session_id, questionnaire_id, question_id, and answers are required",
    });
  }

  const answersArray = Array.isArray(answers) ? answers : [answers];

  db.beginTransaction((err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const query = `INSERT INTO user_responses 
                   (session_id, questionnaire_id, question_id, answer_text, answer_choice_id)
                   VALUES (?, ?, ?, ?, ?)`;

    const insertedIds = [];
    let completedInserts = 0;

    answersArray.forEach((answer) => {
      db.query(
        query,
        [
          session_id,
          questionnaire_id,
          question_id,
          answer.answer_text || null,
          answer.answer_choice_id || null,
        ],
        (err, results) => {
          if (err) {
            return db.rollback(() => {
              res.status(500).json({ error: err.message });
            });
          }

          insertedIds.push(results.insertId);
          completedInserts++;

          if (completedInserts === answersArray.length) {
            db.commit((err) => {
              if (err) {
                return db.rollback(() => {
                  res.status(500).json({ error: err.message });
                });
              }

              res.json({
                message: `${insertedIds.length} response(s) saved successfully`,
                ids: insertedIds,
              });
            });
          }
        },
      );
    });
  });
};

const updateCompletionsCount = (req, res) => {
  const { amount_of_completions, id } = req.body;
  const query = `UPDATE questionnaires SET amount_of_completions = ?
                         WHERE id = ?`;

  db.query(query, [amount_of_completions, id], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
    }
    res.json({
      message: "Unbelievable success!!!",
    });
  });
};

module.exports = { submitAnswer, updateCompletionsCount };
