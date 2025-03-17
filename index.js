const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const questionnaireRoutes = require("./back/routes/questionnairesRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

app.use(bodyParser.json());

app.use("/api", questionnaireRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
