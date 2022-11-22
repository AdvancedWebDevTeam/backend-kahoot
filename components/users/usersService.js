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
  let query = `select u.users_name, u.email, u.create_at, u.expire_at, k.groups_name, r.roles_name
                from users as u, kahoot_groups as k, roles as r, roles_groups_users as rgu
                where u.users_id = '${ID}' and u.users_id = rgu.users_id and rgu.groups_id = k.groups_id and rgu.roles_id = r.roles_id`;
  const result = await sequelize.query(query, function (err, result, fields) {
    if (err) throw err;
    console.log(result);
  });

  return result;
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
  const createAt = `${currentdate.getFullYear()}-${
    currentdate.getMonth() + 1
  }-${currentdate.getDate()}`;
  const someDate = new Date();
  const numberOfDaysToAdd = 30;
  const result = someDate.setDate(someDate.getDate() + numberOfDaysToAdd);
  const expiredDate = new Date(result);
  const expireAt = `${expiredDate.getFullYear()}-${
    expiredDate.getMonth() + 1
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

exports.resgisterUsersByGoogleAccount = async (users_name, email) => {

  await sequelize.query("call sp_addidusers()", {}).then((v) => console.log(v));

  const user = await models.users.findOne({
    attributes: ["users_id"],
    where: { users_password: null },
    raw: true
  });

  const userID = user.users_id;

  const currentdate = new Date();
  const createAt = `${currentdate.getFullYear()}-${
    currentdate.getMonth() + 1
  }-${currentdate.getDate()}`;
  const someDate = new Date();
  const numberOfDaysToAdd = 30;
  const result = someDate.setDate(someDate.getDate() + numberOfDaysToAdd);
  const expiredDate = new Date(result);
  const expireAt = `${expiredDate.getFullYear()}-${
    expiredDate.getMonth() + 1
  }-${expiredDate.getDate()}`;

  const token = randomstring.generate(32);

  const query_update = `update users set 
    users_name = '${users_name}', 
    email = '${email}', 
    create_at = '${createAt}',
    expire_at = '${expireAt}',
    tokens = '${token}' where users_id = '${userID}'`;

  await sequelize.query(query_update, {}).then((v) => console.log(v));

  const new_user = await models.users.findOne({
    attributes: ["users_id", "users_name", "email", "tokens"],
    where: { users_id: userID },
    raw: true
  });

  return new_user;
}