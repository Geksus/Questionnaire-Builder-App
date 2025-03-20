const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const questionnaireRoutes = require("./back/routes/questionnairesRoutes");
const answerRoutes = require("./back/routes/answersRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

app.use(bodyParser.json());

app.use("/api", questionnaireRoutes);
app.use("/api", answerRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
