const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('questions', {
    questions_id: {
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
    is_answer: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0
    },
    vote: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    questions_time: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'questions',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "questions_id" },
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
