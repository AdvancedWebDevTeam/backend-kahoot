const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('slides', {
    slides_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
    },
    presents_id: {
      type: DataTypes.CHAR(36),
      allowNull: true,
      references: {
        model: 'presentations',
        key: 'presents_id'
      }
    },
    types_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'slide_types',
        key: 'types_id'
      }
    },
    content: {
      type: DataTypes.CHAR(255),
      allowNull: true
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'slides',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "slides_id" },
        ]
      },
      {
        name: "presents_id",
        using: "BTREE",
        fields: [
          { name: "presents_id" },
        ]
      },
      {
        name: "types_id",
        using: "BTREE",
        fields: [
          { name: "types_id" },
        ]
      },
    ]
  });
};
