module.exports = (sequelize, DataTypes) => {

  return sequelize.define('food', {
    'name': DataTypes.STRING(45),
    'pic': DataTypes.TEXT,
    'category': DataTypes.TEXT,
    'team': DataTypes.STRING(25),
    'alias': DataTypes.STRING(45),
    'kw': DataTypes.DOUBLE,
    'people': DataTypes.TEXT,
    'icon': DataTypes.STRING(125),
    'description': DataTypes.TEXT,
    'nutrition': DataTypes.TEXT,
    'effect': DataTypes.TEXT,
    'selection': DataTypes.TEXT,
    'saveway': DataTypes.TEXT,
    'phase': DataTypes.TEXT,
    'match': DataTypes.TEXT,
    'dishes': DataTypes.TEXT,
  })
}
