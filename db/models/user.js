const bcrypt = require('bcryptjs');

'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    userName: DataTypes.STRING,
    userEmail: DataTypes.STRING,
    hashedPassword: DataTypes.STRING,
    profilePic: DataTypes.STRING
  }, {});
  User.associate = function (models) {
    // associations can be defined here
    User.hasMany(models.Post, { foreignKey: 'userID' });
    User.hasMany(models.Comment, { foreignKey: 'userID' });
  };


  User.prototype.validatePassword = function (password) {
    return bcrypt.compareSync(password, this.hashedPassword.toString());
  };


  return User;
};