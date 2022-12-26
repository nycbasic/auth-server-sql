// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");

const crypto = require("crypto");
const User = require("../../models/Users");
const { transporter, resetPasswordEmail } = require("../../config/mail");

const checkUser = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (user.email && user.password) {
      // create token
      const token = await crypto.randomBytes(20).toString("hex");

      // add token to user profile
      if (!user.resetToken) {
        user.resetToken = token;
        user.save();
      } else {
        return res.status(400).json({
          msg: "User previously requested reset!",
        });
      }

      // send email with token credentials
      const email = resetPasswordEmail(user.email, token);
      const info = await transporter.sendMail(email);
      // send a response to user "email sent!"
      console.log(email);
      return res.status(200).json({
        status: "Local user",
        token,
      });
    }
    // return response that the user does not exist
    return res.status(400).json({
      status: "User cannot reset password!",
    });
  } catch (err) {
    console.log(err)
    return res.sendStatus(400);
  }
};

const forgotPassword = (req, res) => {
  return res.status(200).json({
    message: "forgot password endpoint success",
    data: req.body,
  });
};

const userDelete = (req, res) => {
  return res.status(200).json({
    message: "delete user endpoint success",
    data: req.body,
  });
};

module.exports = {
  userDelete,
  checkUser,
  forgotPassword,
};
