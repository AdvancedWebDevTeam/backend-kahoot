const usersService = require("./usersService");
const sendEmail = require("./sendEmail");

exports.getUser = async (req, res) => {
  const result = await usersService.getUsers();
  res.json(result);
};

exports.getUserProfile = async (req, res) => {
  const ID = req.params.id;
  const result = await usersService.getUserProfile(ID);
  res.json(result);
};

exports.updateUserProfile = async (req, res) => {
  const {users_id, users_name, email, password} = req.body;
  const result = await usersService.updateUserProfile(users_id, users_name, email, password);
  res.json(result);
};

exports.registerUser = async (req, res) => {
  const users_name = req.body.username;
  const { email } = req.body;
  const { password } = req.body;

  const check = await usersService.checkUsersNotVerified(email);
  //console.log(check);
  if (check === null) {
    const result = await usersService.registerUsers(
      users_name,
      email,
      password
    );
    const token = await usersService.createRegisterToken(result.user.users_id)
    const url = `${process.env.BASE_URL}/${result.user.users_id}/verify/${token}`;
    await sendEmail(result.user.email, "Verify account email", url);
    res.status(201).json(url);
  } else {
    if(check.is_verified) {
      res.status(401).json("Already have account");
    }
    else {
      const token = await usersService.createRegisterToken(check.users_id)
      const url = `${process.env.BASE_URL}/${check.users_id}/verify/${token}`;
      await sendEmail(check.email, "Verify account email", url);
      res.status(401).json(
        "Account was created but not verified. " + 
        "Please visit email to verify. Token is about to expire in 15 minutes"
      );
    }
  }
};

exports.updateVerify = async (req, res) => {
  const { id } = req.params;
  const user = await usersService.getUserByID(id);
  if (user.users_id === null || user.tokens === null) {
    res.json(500).json("Invalid server");
  } else {
    await usersService.updateVerify(id);
    res.status(201).json(user);
  }
};

exports.getAllUsers = async (_, res) => {
  const result = await usersService.getAllUsers();
  res.status(200).json(result);
};

exports.checkPassword = async (req, res) => {
  const {id, value} = req.params;
  const result = await usersService.CheckPassword(id, value);
  if (!result) {
    res.json("Wrong password");
  } else {
    res.json("Right password");
  }
};

exports.updatePassword = async (req, res) => {
  const { confirmPassword, userId } = req.body;
  const result = await usersService.updatePassword(confirmPassword, userId);
  if(result) {
    res.status(200).send("Reset password succesfully");
  } else {
    res.status(405).send("Fail to reset password")
  }
}

exports.createResetPasswordToken = async(req, res) => {
  const { email } = req.body;
  const resetPaswordToken = await usersService.createResetPasswordToken(email);
  if(resetPaswordToken !== "") {
    const url = `${process.env.BASE_URL}/resetpassword/${resetPaswordToken}`;
    await sendEmail(email, "Reset password email", url);
    res.status(200).json(url);
  } else {
    res.status(405).send("Fail to create reset password token");
  }
}