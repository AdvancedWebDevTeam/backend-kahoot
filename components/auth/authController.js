const authService = require("./authService");
require("dotenv").config();

exports.login = async (req, res) => {
  // console.log(`AUTH CONTROLLER: ${req.user}`);
  if (req.user !== undefined) {
    const result = authService.JWT_Sign(req.user);
    res.status(201).json(result);
  }
};

exports.getProfile = async (req, res) => {
  const user = {
    users_id: req.user.users_id,
    users_name: req.user.users_name,
    email: req.user.email
  };
  res.status(200).json(user);
};

exports.loginGoogle = async (req, res) => {
  // console.log(req.user);
  if (req.user !== undefined) {
    const result = authService.JWT_Sign(req.user);
    res.redirect(`${process.env.BASE_URL}/login/google/success/${result}`);
  } else {
    res.redirect(`${process.env.BASE_URL}/login/google/failure`);
  }
};
