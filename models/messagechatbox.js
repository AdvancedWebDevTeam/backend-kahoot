const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('messagechatbox', {
    messagechatbox_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
    },
    users_id: {
      type: DataTypes.CHAR(36),
      allowNull: true,
      references: {
        model: 'users',
        key: 'users_id'
      }
    },
    presents_id: {
      type: DataTypes.CHAR(36),
      allowNull: true,
      references: {
        model: 'presentations',
        key: 'presents_id'
      }
    },
    content: {
      type: DataTypes.CHAR(255),
      allowNull: true
    },
    questions_time: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'messagechatbox',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "messagechatbox_id" },
        ]
      },
      {
        name: "users_id",
        using: "BTREE",
        fields: [
          { name: "users_id" },
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
