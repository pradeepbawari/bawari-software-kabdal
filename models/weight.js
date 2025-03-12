// models/weight.js
module.exports = (sequelize, DataTypes) => {
	const Weight = sequelize.define('Weight', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      weight: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      unit: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      height: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      height_unit: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      capacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      capacity_unit: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      tableName: "weights",
      timestamps: false, // No createdAt or updatedAt fields
    }
  );

  return Weight;
};
