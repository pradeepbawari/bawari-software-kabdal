// models/Variant.js
module.exports = (sequelize, DataTypes) => {
	const Variant = sequelize.define('Variant', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      product_id : {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      color_id : {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      weight_id : {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      price : {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      sale_price : {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      stock : {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      deleted : {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        unique: true,
      },
    },
    {
      tableName: "product_variants",
      timestamps: false, // No createdAt or updatedAt fields
    }
  );

  return Variant;
};
