const mysql = require("mysql2");
require("dotenv").config();

const connection = mysql.createConnection({
  host: "localhost",
  user: "localuser",
  password: "localpasswd",
  database: "q_db",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to DB: ", err);
    return;
  }
  console.log(`Connected to database`);
});

module.exports = connection;
