module.exports = (sequelize, DataTypes) => {
  const Subcategory = sequelize.define(
    "Subcategory",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      category_id: {
        type: DataTypes.INTEGER,
        allowNull: true, // ✅ Make it optional because some subcategories will have only parent_id
        references: {
          model: "productcategories", // Links to categories table
          key: "id",
        },
      },
      parent_id: {
        type: DataTypes.INTEGER,
        allowNull: true, // ✅ Allows for nesting
        references: {
          model: "subcategories", // ✅ Self-referencing foreign key
          key: "id",
        },
      },
      
      icon: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      tableName: "subcategories",
      timestamps: false,
    }
  );

  return Subcategory;
};
