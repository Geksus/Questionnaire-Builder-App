const express = require("express");
const bodyParser = require("body-parser");
const questionnairRoutes = require("./back/routes/questionnairsRoutes");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

app.use(bodyParser.json());

app.use("/api", questionnairRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
