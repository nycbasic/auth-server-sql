require("dotenv").config();
const express = require("express");
const db = require("./config/sequelize");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const session = require("express-session");
const cors = require("cors");

const app = express();
const port = process.env.PORT;
const users = require("./routes/Users");
const auth = require("./routes/Auth");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SECRET,
  })
);

app.use(passport.initialize());
app.use(passport.session());
require("./config/passport/jwtcookie")(passport);
require("./config/passport/google")(passport);
require("./config/passport/facebook")(passport);
app.use(cors());

app.use("/api/auth/v1", auth);
app.use("/api/users/v1", users);

db.authenticate()
  .then(() => console.log("connected to PostGRES-SQL"))
  .then(() => {
    // db.sync({ force: true });
    db.sync({ alter: true });
    // db.sync();
  })
  .then(() => {
    app.listen(port, () => {
      console.log("server connected to: " + port);
    });
  })
  .catch((err) => {
    console.log(err);
  });
