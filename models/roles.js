module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "roles",
    {
      roles_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      roles_name: {
        type: DataTypes.CHAR(100),
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "roles",
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "roles_id" }]
        }
      ]
    }
  );
};
