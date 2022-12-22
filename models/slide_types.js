const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('slide_types', {
    types_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    types_name: {
      type: DataTypes.CHAR(36),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'slide_types',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "types_id" },
        ]
      },
    ]
  });
};
