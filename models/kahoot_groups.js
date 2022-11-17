const Sequelize = require("sequelize");

module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "kahoot_groups",
    {
      groups_id: {
        type: DataTypes.CHAR(36),
        allowNull: false,
        primaryKey: true
      },
      groups_name: {
        type: DataTypes.CHAR(100),
        allowNull: true
      },
      is_deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: 0
      }
    },
    {
      sequelize,
      tableName: "kahoot_groups",
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "groups_id" }]
        }
      ]
    }
  );
};
