// models/category.js
module.exports = (sequelize, DataTypes) => {
	const Category = sequelize.define('Category', {
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
      tableName: "productcategories",
      timestamps: false, // No createdAt or updatedAt fields
    }
  );

  return Category;
};
