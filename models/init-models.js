var DataTypes = require("sequelize").DataTypes;
var _collaborators = require("./collaborators");
var _kahoot_groups = require("./kahoot_groups");
var _messagechatbox = require("./messagechatbox");
var _presentations = require("./presentations");
var _questions = require("./questions");
var _roles = require("./roles");
var _roles_groups_users = require("./roles_groups_users");
var _slide_present = require("./slide_present");
var _slide_types = require("./slide_types");
var _slides = require("./slides");
var _submit_content = require("./submit_content");
var _users = require("./users");

function initModels(sequelize) {
  var collaborators = _collaborators(sequelize, DataTypes);
  var kahoot_groups = _kahoot_groups(sequelize, DataTypes);
  var messagechatbox = _messagechatbox(sequelize, DataTypes);
  var presentations = _presentations(sequelize, DataTypes);
  var questions = _questions(sequelize, DataTypes);
  var roles = _roles(sequelize, DataTypes);
  var roles_groups_users = _roles_groups_users(sequelize, DataTypes);
  var slide_present = _slide_present(sequelize, DataTypes);
  var slide_types = _slide_types(sequelize, DataTypes);
  var slides = _slides(sequelize, DataTypes);
  var submit_content = _submit_content(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);

  presentations.belongsToMany(users, { as: 'users_id_users', through: collaborators, foreignKey: "presents_id", otherKey: "users_id" });
  slides.belongsToMany(users, { as: 'users_id_users_submit_contents', through: submit_content, foreignKey: "slides_id", otherKey: "users_id" });
  users.belongsToMany(presentations, { as: 'presents_id_presentations', through: collaborators, foreignKey: "users_id", otherKey: "presents_id" });
  users.belongsToMany(slides, { as: 'slides_id_slides', through: submit_content, foreignKey: "users_id", otherKey: "slides_id" });
  presentations.belongsTo(kahoot_groups, { as: "group", foreignKey: "groups_id"});
  kahoot_groups.hasMany(presentations, { as: "presentations", foreignKey: "groups_id"});
  roles_groups_users.belongsTo(kahoot_groups, { as: "group", foreignKey: "groups_id"});
  kahoot_groups.hasMany(roles_groups_users, { as: "roles_groups_users", foreignKey: "groups_id"});
  collaborators.belongsTo(presentations, { as: "present", foreignKey: "presents_id"});
  presentations.hasMany(collaborators, { as: "collaborators", foreignKey: "presents_id"});
  messagechatbox.belongsTo(presentations, { as: "present", foreignKey: "presents_id"});
  presentations.hasMany(messagechatbox, { as: "messagechatboxes", foreignKey: "presents_id"});
  questions.belongsTo(presentations, { as: "present", foreignKey: "presents_id"});
  presentations.hasMany(questions, { as: "questions", foreignKey: "presents_id"});
  slide_present.belongsTo(presentations, { as: "present", foreignKey: "presents_id"});
  presentations.hasOne(slide_present, { as: "slide_present", foreignKey: "presents_id"});
  slides.belongsTo(presentations, { as: "present", foreignKey: "presents_id"});
  presentations.hasMany(slides, { as: "slides", foreignKey: "presents_id"});
  roles_groups_users.belongsTo(roles, { as: "role", foreignKey: "roles_id"});
  roles.hasMany(roles_groups_users, { as: "roles_groups_users", foreignKey: "roles_id"});
  slides.belongsTo(slide_types, { as: "type", foreignKey: "types_id"});
  slide_types.hasMany(slides, { as: "slides", foreignKey: "types_id"});
  submit_content.belongsTo(slides, { as: "slide", foreignKey: "slides_id"});
  slides.hasMany(submit_content, { as: "submit_contents", foreignKey: "slides_id"});
  collaborators.belongsTo(users, { as: "user", foreignKey: "users_id"});
  users.hasMany(collaborators, { as: "collaborators", foreignKey: "users_id"});
  messagechatbox.belongsTo(users, { as: "user", foreignKey: "users_id"});
  users.hasMany(messagechatbox, { as: "messagechatboxes", foreignKey: "users_id"});
  presentations.belongsTo(users, { as: "creator", foreignKey: "creators_id"});
  users.hasMany(presentations, { as: "presentations", foreignKey: "creators_id"});
  questions.belongsTo(users, { as: "user", foreignKey: "users_id"});
  users.hasMany(questions, { as: "questions", foreignKey: "users_id"});
  roles_groups_users.belongsTo(users, { as: "user", foreignKey: "users_id"});
  users.hasMany(roles_groups_users, { as: "roles_groups_users", foreignKey: "users_id"});
  submit_content.belongsTo(users, { as: "user", foreignKey: "users_id"});
  users.hasMany(submit_content, { as: "submit_contents", foreignKey: "users_id"});

  return {
    collaborators,
    kahoot_groups,
    messagechatbox,
    presentations,
    questions,
    roles,
    roles_groups_users,
    slide_present,
    slide_types,
    slides,
    submit_content,
    users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
