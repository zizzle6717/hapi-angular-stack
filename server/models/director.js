'use strict';

module.exports = function(sequelize, DataTypes) {
  let Director = sequelize.define("Director", {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // create one to many relationship
        Director.hasMany(models.Movie);
      }
    }
  });
  return Director;
};
