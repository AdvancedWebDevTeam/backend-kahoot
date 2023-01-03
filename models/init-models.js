const { DataTypes } = require("sequelize");
const _kahoot_groups = require("./kahoot_groups");
const _roles = require("./roles");
const _roles_groups_users = require("./roles_groups_users");
const _users = require("./users");
const _presentations = require("./presentations");
const _slide_types = require("./slide_types");
const _slides = require("./slides");
const _slide_present = require("./slide-present");
const _collaborators = require("./collaborators");
const _messagechatbox = require("./messagechatbox");
const _questions = require("./questions");

function initModels(sequelize) {
  const kahoot_groups = _kahoot_groups(sequelize, DataTypes);
  const roles = _roles(sequelize, DataTypes);
  const roles_groups_users = _roles_groups_users(sequelize, DataTypes);
  const users = _users(sequelize, DataTypes);
  const presentations = _presentations(sequelize, DataTypes);
  const slide_types = _slide_types(sequelize, DataTypes);
  const slides = _slides(sequelize, DataTypes);
  const slide_present = _slide_present(sequelize, DataTypes);
  const collaborators = _collaborators(sequelize, DataTypes);
  const messagechatbox = _messagechatbox(sequelize, DataTypes);
  const questions = _questions(sequelize, DataTypes);

  presentations.belongsToMany(users, {
    as: "users_id_users",
    through: collaborators,
    foreignKey: "presents_id",
    otherKey: "users_id"
  });
  users.belongsToMany(presentations, {
    as: "presents_id_presentations",
    through: collaborators,
    foreignKey: "users_id",
    otherKey: "presents_id"
  });
  presentations.belongsTo(kahoot_groups, {
    as: "group",
    foreignKey: "groups_id"
  });
  kahoot_groups.hasMany(presentations, {
    as: "presentations",
    foreignKey: "groups_id"
  });
  roles_groups_users.belongsTo(kahoot_groups, {
    as: "group",
    foreignKey: "groups_id"
  });
  kahoot_groups.hasMany(roles_groups_users, {
    as: "roles_groups_users",
    foreignKey: "groups_id"
  });
  collaborators.belongsTo(presentations, {
    as: "present",
    foreignKey: "presents_id"
  });
  presentations.hasMany(collaborators, {
    as: "collaborators",
    foreignKey: "presents_id"
  });
  messagechatbox.belongsTo(presentations, {
    as: "present",
    foreignKey: "presents_id"
  });
  presentations.hasMany(messagechatbox, {
    as: "messagechatboxes",
    foreignKey: "presents_id"
  });
  questions.belongsTo(presentations, {
    as: "present",
    foreignKey: "presents_id"
  });
  presentations.hasMany(questions, {
    as: "questions",
    foreignKey: "presents_id"
  });
  slides.belongsTo(presentations, { as: "present", foreignKey: "presents_id" });
  presentations.hasMany(slides, { as: "slides", foreignKey: "presents_id" });
  roles_groups_users.belongsTo(roles, { as: "role", foreignKey: "roles_id" });
  roles.hasMany(roles_groups_users, {
    as: "roles_groups_users",
    foreignKey: "roles_id"
  });
  slides.belongsTo(slide_types, { as: "type", foreignKey: "types_id" });
  slide_types.hasMany(slides, { as: "slides", foreignKey: "types_id" });
  collaborators.belongsTo(users, { as: "user", foreignKey: "users_id" });
  users.hasMany(collaborators, { as: "collaborators", foreignKey: "users_id" });
  messagechatbox.belongsTo(users, { as: "user", foreignKey: "users_id" });
  users.hasMany(messagechatbox, {
    as: "messagechatboxes",
    foreignKey: "users_id"
  });
  presentations.belongsTo(users, { as: "user", foreignKey: "creators_id" });
  users.hasMany(presentations, {
    as: "presentations",
    foreignKey: "creators_id"
  });
  questions.belongsTo(users, { as: "user", foreignKey: "users_id" });
  users.hasMany(questions, { as: "questions", foreignKey: "users_id" });
  roles_groups_users.belongsTo(users, { as: "user", foreignKey: "users_id" });
  users.hasMany(roles_groups_users, {
    as: "roles_groups_users",
    foreignKey: "users_id"
  });

  slide_present.belongsTo(presentations, {as: "presentations", foreignKey: "presents_id"})

  return {
    collaborators,
    kahoot_groups,
    messagechatbox,
    presentations,
    questions,
    roles,
    roles_groups_users,
    slide_types,
    slides,
    users,
    slide_present
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
