module.exports = (sequelize, DataTypes) => {

  return sequelize.define('foodtodish', {
    'food_id': DataTypes.INTEGER,
    'dish_id': DataTypes.INTEGER
  })
}
