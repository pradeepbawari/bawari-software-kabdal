// models/product.js
module.exports = (sequelize, DataTypes) => {
  const ProductNew = sequelize.define('products_new', {
    product_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.STRING },
  }, {
    tableName: 'products_new',
    timestamps: true,
  });

  return ProductNew;
};
