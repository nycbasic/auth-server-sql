const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../models/Users");

const userLogin = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      error: "FROM USERLOGIN, NO EMAIL OR PASSWORD!",
    });
  }
  const user = await User.findOne({ where: { email } });

  if (!user) {
    return res.status(400).json({
      message: "User does not exist!",
    });
  }

  try {
    const { dataValues } = user;
    bcrypt.compare(password, dataValues.password, async (err, success) => {
      if (err) {
        return res.status(400).send(err);
      }
      if (success) {
        const { id, firstName, lastName } = user;
        const payload = {
          id,
          firstName,
          lastName,
        };
        const token = await jwt.sign(payload, process.env.SECRET);

        return res
          .cookie("jwt", token, { httpOnly: true, sameSite: true })
          .cookie("payload", token.split(".")[1])
          .status(201)
          .json({
            message: "Successfully logged in!",
            user,
          });
      }
      return res.status(400).json({
        message: "Incorrect password!",
      });
    });
  } catch (error) {
    return res.sendStatus(400);
  }
};

const userSignUp = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const user = await User.findOne({ where: { email } });

  if (user) {
    return res.status(400).json({
      message: "User already exist!",
    });
  }

  try {
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hash,
    });

    const payload = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    const token = await jwt.sign(payload, process.env.SECRET);

    return res
      .cookie("jwt", token, { httpOnly: true, sameSite: true })
      .cookie("payload", token.split(".")[1])
      .status(200)
      .json({
        token,
      });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      error: "Something went wrong",
    });
  }
};




module.exports = {
  userLogin,
  userSignUp
};
