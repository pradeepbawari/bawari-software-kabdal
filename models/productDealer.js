module.exports = (sequelize, DataTypes) => {
    const ProductDealers = sequelize.define('product_dealers', {
        product_id: {
          type: DataTypes.INTEGER,
          references: {
            model: 'products',
            key: 'id',
          },
          onDelete: 'CASCADE',
        },
        dealer_id: {
          type: DataTypes.INTEGER,
          references: {
            model: 'dealers',
            key: 'id',
          },
          onDelete: 'CASCADE',
        },
       }, {
          tableName: 'product_dealers',
          timestamps: true,
      });
    return ProductDealers;
};