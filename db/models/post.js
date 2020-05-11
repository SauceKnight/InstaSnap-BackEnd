'use strict';
module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    caption: DataTypes.STRING,
    userID: DataTypes.INTEGER,
    image: DataTypes.STRING
  }, {});
  Post.associate = function (models) {
    // associations can be defined here
    Post.belongsTo(models.User, { foreignKey: 'userID' });
  };
  return Post;
};