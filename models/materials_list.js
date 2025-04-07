// models/category.js
module.exports = (sequelize, DataTypes) => {
	const MaterialsList = sequelize.define('materials_list', {
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
      tableName: "materials_list",
      timestamps: false, // No createdAt or updatedAt fields
    }
  );

  return MaterialsList;
};
