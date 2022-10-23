require("dotenv").config();
const express = require("express");
const db = require("./config/sequelize");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = process.env.PORT;
const users = require("./routes/Users");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

db.authenticate()
  .then(db.sync({force: false}))
  .then(() => console.log("Connected to PostGRES & Model Synced!"))
  .catch((err) => {
    console.log(err);
  });

app.use("/api/users/v1", users);

app.listen(port, () => {
  console.log("server connected to: " + port);
});
