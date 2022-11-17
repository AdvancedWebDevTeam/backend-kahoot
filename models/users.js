const Sequelize = require("sequelize");

module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "users",
    {
      users_id: {
        type: DataTypes.CHAR(36),
        allowNull: false,
        primaryKey: true
      },
      users_name: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      email: {
        type: DataTypes.CHAR(255),
        allowNull: true
      },
      users_password: {
        type: DataTypes.CHAR(255),
        allowNull: true
      },
      is_verified: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: 0
      },
      create_at: {
        type: DataTypes.DATE,
        allowNull: true
      },
      expire_at: {
        type: DataTypes.DATE,
        allowNull: true
      },
      tokens: {
        type: DataTypes.CHAR(255),
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "users",
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "users_id" }]
        }
      ]
    }
  );
};
