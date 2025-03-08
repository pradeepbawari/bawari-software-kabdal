// models/order.js
module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    // Define model attributes
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    status: { type: DataTypes.ENUM("Pending", "Completed", "Cancelled"), defaultValue: "Pending" },
    statusType: { type: DataTypes.ENUM("Ordered", "Downloaded") },
	  payment_status: { type: DataTypes.ENUM("Pending", "Paid"), defaultValue: "Pending" },
    total_amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    gst_amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    grand_total: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    offer: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    comments: { type: DataTypes.STRING, allowNull: false, unique: true, defaultValue: "" },
  }, {
    tableName: 'Orders',
    timestamps: true,
  });

  // Return the model
  return Order;
};
