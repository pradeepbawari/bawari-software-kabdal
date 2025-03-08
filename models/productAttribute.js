// models/product.js
module.exports = (sequelize, DataTypes) => {
  const ProductAttribute = sequelize.define('productattributes_new', {
    attribute_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    attribute_name: { type: DataTypes.STRING },
    attribute_value: { type: DataTypes.STRING },
  }, {
    tableName: 'productattributes_new',
    timestamps: true,
  });

  return ProductAttribute;
};
