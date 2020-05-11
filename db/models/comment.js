'use strict';
module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    comment: DataTypes.STRING,
    userID: DataTypes.INTEGER,
    postID: DataTypes.INTEGER
  }, {});
  Comment.associate = function (models) {
    Comment.belongsTo(models.Post, { foreignKey: 'postID' });
    Comment.belongsTo(models.User, { foreignKey: 'userID' });
  };
  return Comment;
};