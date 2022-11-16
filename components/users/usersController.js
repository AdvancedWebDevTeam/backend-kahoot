const usersService = require("./usersService");
const sendEmail = require('./sendEmail')
require('dotenv').config();

exports.getUser = async (req, res) => {
  const result = await usersService.getUsers();
  res.json(result);
};

exports.registerUser = async (req, res) => {
  const users_name = req.body.username;
  const { email } = req.body;
  const { password } = req.body;

  const check = await usersService.checkUsers(email);
  console.log(check);
  if (check === null) {
    const result = await usersService.registerUsers(
      users_name,
      email,
      password
    );
    res.status(201).json(result);
  } else {
    res.status(401).json("Already have account");
  }
};

exports.registerUser = async (req, res) => {
  const users_name = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  
  const check = await usersService.checkUsers(email)
  console.log(check)
  if(check === null)
  {
      const result = await usersService.registerUsers(users_name, email, password);
      const url = `${process.env.BASE_URL}/:${result.user.users_id}/verify/:${result.user.tokens}`
      await sendEmail(result.user.email, "Verify email", url)
      res.status(201).json("An email has sent to verify your account")
  }
  else
  {
      res.status(401).json("Already have account")
  }
}

exports.updateVerify = async(req, res) => {
  const id = req.params.id.replace(':', '');
  const user = await usersService.getUserByID(id)
  //console.log('Hello VERIFY')
  //console.log(req.params.id)
  if(user.users_id === null || user.tokens === null)
  {
      res.json(500).json("Invalid server")
  }
  else
  {
      await usersService.updateVerify(id)
      res.status(201).json(user)
  }
}
