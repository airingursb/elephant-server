module.exports = (sequelize, DataTypes) => {

  return sequelize.define('dish', {
    'name': DataTypes.STRING(45),
    'alias': DataTypes.STRING(45),
    'category': DataTypes.TEXT,
    'difficulty': DataTypes.STRING(25),
    'time': DataTypes.STRING(25),
    'pic': DataTypes.TEXT,
    'material': DataTypes.TEXT,
    'coke_step': DataTypes.TEXT,
    'coke_pic': DataTypes.TEXT,
    'description': DataTypes.TEXT,
    'related': DataTypes.TEXT,
    'tips': DataTypes.TEXT,
  })
}
