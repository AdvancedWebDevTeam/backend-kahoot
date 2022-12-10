module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "presentations",
    {
      presents_id: {
        type: DataTypes.CHAR(36),
        allowNull: false,
        primaryKey: true
      },
      groups_id: {
        type: DataTypes.CHAR(36),
        allowNull: true,
        references: {
          model: "kahoot_groups",
          key: "groups_id"
        }
      },
      creators_id: {
        type: DataTypes.CHAR(36),
        allowNull: true,
        references: {
          model: "users",
          key: "users_id"
        }
      },
      presents_name: {
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
      tableName: "presentations",
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "presents_id" }]
        },
        {
          name: "creators_id",
          using: "BTREE",
          fields: [{ name: "creators_id" }]
        },
        {
          name: "groups_id",
          using: "BTREE",
          fields: [{ name: "groups_id" }]
        }
      ]
    }
  );
};
