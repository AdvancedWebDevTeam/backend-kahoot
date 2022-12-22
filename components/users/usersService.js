const bcrypt = require("bcrypt");
const randomstring = require("randomstring");
const { models } = require("../../models");
const { sequelize } = require("../../models/index");

exports.getUsers = async () => {
  const result = await models.users.findAll({
    raw: true
  });

  return result;
};

exports.checkUsers = async (email) => {
  const result = await models.users.findOne({
    attributes: ["users_id", "users_name", "email", "users_password"],
    where: { email: email },
    raw: true
  });

  return result;
};

exports.getUserByID = async (ID) => {
  const result = await models.users.findOne({
    attributes: ["users_id", "users_name", "email", "tokens"],
    where: { users_id: ID },
    raw: true
  });

  return result;
};

exports.getUserProfile = async (ID) => {
  const result = await models.users.findOne({
    attributes: ["users_name", "email", "users_password"],
    where: { users_id: ID },
    raw: true
  });

  return result;
};

exports.updateUserProfile = async (ID, username, email, password) => {
  const currentdate = new Date();
  const createAt = `${currentdate.getFullYear()}-${currentdate.getMonth() + 1
    }-${currentdate.getDate()}`;
  const user = await models.users.findOne({
    attributes: ["users_password"],
    where: { users_id: ID },
    raw: true
  });
  let hash = await bcrypt.hash(password, 10);
  if (user.users_password === password) {
    hash = password;
  }
  else if (!bcrypt.compare(password, user.users_password)) {
    hash = user.users_password;
  }
  const query_update = `update users set 
    users_name = '${username}', 
    email = '${email}',
    create_at = '${createAt}',
    users_password = '${hash}'
    where users_id = '${ID}'`;
  try {
    await sequelize.query(query_update, {});
    return "Update user success!"
  } catch (err) {
    return "Fail to update user!"
  }
};

exports.registerUsers = async (users_name, email, password) => {
  await sequelize.query("call sp_addidusers()", {}).then((v) => console.log(v));

  const user = await models.users.findOne({
    attributes: ["users_id"],
    where: { users_password: null },
    raw: true
  });

  const userID = user.users_id;
  const hashPass = await bcrypt.hash(password, 10);

  const currentdate = new Date();
  const createAt = `${currentdate.getFullYear()}-${currentdate.getMonth() + 1
    }-${currentdate.getDate()}`;
  const someDate = new Date();
  const numberOfDaysToAdd = 30;
  const result = someDate.setDate(someDate.getDate() + numberOfDaysToAdd);
  const expiredDate = new Date(result);
  const expireAt = `${expiredDate.getFullYear()}-${expiredDate.getMonth() + 1
    }-${expiredDate.getDate()}`;

  const token = randomstring.generate(32);

  const query_update = `update users set 
    users_name = '${users_name}', 
    email = '${email}', 
    users_password = '${hashPass}',
    create_at = '${createAt}',
    expire_at = '${expireAt}',
    tokens = '${token}' where users_id = '${userID}'`;

  await sequelize.query(query_update, {}).then((v) => console.log(v));

  const new_user = await models.users.findOne({
    attributes: ["users_id", "users_name", "email", "tokens"],
    where: { users_id: userID },
    raw: true
  });

  return {
    is_success: true,
    user: new_user
  };
};

exports.updateVerify = async (id) => {
  const query_update = `update users set is_verified = true where users_id = '${id}'`;

  await sequelize.query(query_update, {}).then((v) => console.log(v));
};

exports.CheckPassword = async (id, value) => {
  const result = await models.users.findOne({
    attributes: ["users_id", "users_password"],
    where: { users_id: id },
    raw: true
  });
  if (!result) {
    return;
  }
  else {
    return bcrypt.compare(value, result.users_password);
  }
};

exports.resgisterUsersByGoogleAccount = async (users_name, email) => {
  await sequelize.query("call sp_addidusers()", {}).then((v) => console.log(v));

  const user = await models.users.findOne({
    attributes: ["users_id"],
    where: { users_password: null },
    raw: true
  });

  const userID = user.users_id;

  const currentdate = new Date();
  const createAt = `${currentdate.getFullYear()}-${currentdate.getMonth() + 1
    }-${currentdate.getDate()}`;
  const someDate = new Date();
  const numberOfDaysToAdd = 30;
  const result = someDate.setDate(someDate.getDate() + numberOfDaysToAdd);
  const expiredDate = new Date(result);
  const expireAt = `${expiredDate.getFullYear()}-${expiredDate.getMonth() + 1
    }-${expiredDate.getDate()}`;

  const token = randomstring.generate(32);

  const query_update = `update users set 
    users_name = '${users_name}', 
    email = '${email}', 
    create_at = '${createAt}',
    expire_at = '${expireAt}',
    tokens = '${token}', 
    is_verified = true where users_id = '${userID}'`;

  await sequelize.query(query_update, {}).then((v) => console.log(v));

  const new_user = await models.users.findOne({
    attributes: ["users_id", "users_name", "email", "tokens"],
    where: { users_id: userID },
    raw: true
  });

  return new_user;
};

exports.getAllUsers = async () => {
  return models.users.findAll({
    attributes: ["users_id", "users_name", "email"],
    raw: true
  });
};
