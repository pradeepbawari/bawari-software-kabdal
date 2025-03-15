module.exports = (sequelize, DataTypes) => {
  const OrderItem = sequelize.define('OrderItem', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    order_id: { type: DataTypes.INTEGER, allowNull: false },
    product_id: { type: DataTypes.INTEGER, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    gst: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    variantId: { type: DataTypes.INTEGER, allowNull: false },
    total: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    weight: { type: DataTypes.INTEGER, allowNull: false },
    unit: { type: DataTypes.STRING, allowNull: false },
    offer: { type: DataTypes.INTEGER, allowNull: false },
    dimensions: { type: DataTypes.JSON, allowNull: false },
}, {
  tableName: 'order_items',
  timestamps: true,
}); 

// Return the model
return OrderItem;
};
