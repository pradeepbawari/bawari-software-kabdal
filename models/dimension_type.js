// models/category.js
module.exports = (sequelize, DataTypes) => {
	const DimensionType = sequelize.define('dimension_type', {
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
      tableName: "dimension_type",
      timestamps: false, // No createdAt or updatedAt fields
    }
  );

  return DimensionType;
};
