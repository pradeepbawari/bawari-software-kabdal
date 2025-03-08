// models/weight.js
module.exports = (sequelize, DataTypes) => {
	const Comments = sequelize.define('Comments', {
    comment_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      order_id : {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      comment_text: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      }
    },
    {
      tableName: "comments",
      timestamps: false, // No createdAt or updatedAt fields
    }
  );

  return Comments;
};
