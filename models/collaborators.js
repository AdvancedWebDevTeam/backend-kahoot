const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('collaborators', {
    users_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'users',
        key: 'users_id'
      }
    },
    presents_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'presentations',
        key: 'presents_id'
      }
    }
  }, {
    sequelize,
    tableName: 'collaborators',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "users_id" },
          { name: "presents_id" },
        ]
      },
      {
        name: "presents_id",
        using: "BTREE",
        fields: [
          { name: "presents_id" },
        ]
      },
    ]
  });
};
