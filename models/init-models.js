const { DataTypes } = require("sequelize");
const _kahoot_groups = require("./kahoot_groups");
const _roles = require("./roles");
const _roles_groups_users = require("./roles_groups_users");
const _users = require("./users");

function initModels(sequelize) {
  const kahoot_groups = _kahoot_groups(sequelize, DataTypes);
  const roles = _roles(sequelize, DataTypes);
  const roles_groups_users = _roles_groups_users(sequelize, DataTypes);
  const users = _users(sequelize, DataTypes);

  roles_groups_users.belongsTo(kahoot_groups, {
    as: "group",
    foreignKey: "groups_id"
  });
  kahoot_groups.hasMany(roles_groups_users, {
    as: "roles_groups_users",
    foreignKey: "groups_id"
  });
  roles_groups_users.belongsTo(roles, { as: "role", foreignKey: "roles_id" });
  roles.hasMany(roles_groups_users, {
    as: "roles_groups_users",
    foreignKey: "roles_id"
  });
  roles_groups_users.belongsTo(users, { as: "user", foreignKey: "users_id" });
  users.hasMany(roles_groups_users, {
    as: "roles_groups_users",
    foreignKey: "users_id"
  });

  return {
    kahoot_groups,
    roles,
    roles_groups_users,
    users
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
