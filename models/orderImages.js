// models/productImages.js
module.exports = (sequelize, DataTypes) => {
  const Orderimages = sequelize.define('Orderimages', {
    // Define model attributes
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    public_id: {
      type: DataTypes.STRING,
      allowNull: false,      
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    }, {
    tableName: 'orderimages',
    timestamps: true,
  });

  // Return the model
  return Orderimages;
};
