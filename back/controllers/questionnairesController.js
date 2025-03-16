const db = require("../../db");

const getQuestionnairs = (req, res) => {
  const query = "SELECT * FROM questionnaires";
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ questionnairs: results });
  });
};

module.exports = getQuestionnairs;
