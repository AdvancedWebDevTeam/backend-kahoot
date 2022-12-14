const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('submit_content', {
    submit_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
    },
    slides_id: {
      type: DataTypes.CHAR(36),
      allowNull: true,
      references: {
        model: 'slides',
        key: 'slides_id'
      }
    },
    users_id: {
      type: DataTypes.CHAR(36),
      allowNull: true,
      references: {
        model: 'users',
        key: 'users_id'
      }
    },
    time_submit: {
      type: DataTypes.DATE,
      allowNull: true
    },
    choice: {
      type: DataTypes.CHAR(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'submit_content',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "submit_id" },
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
        name: "slides_id",
        using: "BTREE",
        fields: [
          { name: "slides_id" },
        ]
      },
    ]
  });
};
