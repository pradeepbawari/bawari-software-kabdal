// models/dealer.js
module.exports = (sequelize, DataTypes) => {
  const Dealer = sequelize.define('Dealer', {
    // Define model attributes
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    mobile_number: {
      type: DataTypes.STRING,
      allowNull: false,
	  unique: true
    },
	address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
	dealer_status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
	company: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    tableName: 'Dealers',
    timestamps: true,
  });

  // Return the model
  return Dealer;
};
