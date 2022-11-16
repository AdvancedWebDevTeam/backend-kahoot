const usersService = require("./usersService");

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
