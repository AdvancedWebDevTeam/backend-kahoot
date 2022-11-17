const Sequelize = require("sequelize");

module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "roles_groups_users",
    {
      users_id: {
        type: DataTypes.CHAR(36),
        allowNull: false,
        primaryKey: true,
        references: {
          model: "users",
          key: "users_id"
        }
      },
      groups_id: {
        type: DataTypes.CHAR(36),
        allowNull: false,
        primaryKey: true,
        references: {
          model: "kahoot_groups",
          key: "groups_id"
        }
      },
      roles_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "roles",
          key: "roles_id"
        }
      }
    },
    {
      sequelize,
      tableName: "roles_groups_users",
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [
            { name: "users_id" },
            { name: "groups_id" },
            { name: "roles_id" }
          ]
        },
        {
          name: "groups_id",
          using: "BTREE",
          fields: [{ name: "groups_id" }]
        },
        {
          name: "roles_id",
          using: "BTREE",
          fields: [{ name: "roles_id" }]
        }
      ]
    }
  );
};
