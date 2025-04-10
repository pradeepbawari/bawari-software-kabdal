// models/category.js
module.exports = (sequelize, DataTypes) => {
	const DimensionUype = sequelize.define('dimension_unit', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      tableName: "dimension_unit",
      timestamps: false, // No createdAt or updatedAt fields
    }
  );

  return DimensionUype;
};
