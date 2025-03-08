// models/user.js
module.exports = (sequelize, DataTypes) => {
  const Setting = sequelize.define('Setting', {
    // Define model attributes
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    company: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    gstin: {
      type: DataTypes.STRING,
      allowNull: false,
	  unique: true
    },    
	mobile: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
	logo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  public_id: {
      type: DataTypes.STRING,
      allowNull: false,
  },
  }, {
    tableName: 'setting',
    timestamps: true,
  });

  // Return the model
  return Setting;
};
