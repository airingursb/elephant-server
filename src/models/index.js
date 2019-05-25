const db = require('../config/sequelize').dbConnect()

// 模型文档：https://www.yuque.com/oh-bear/elephant-fridge/models

const User = db.import('./user')
const Food = db.import('./food')
const Dish = db.import('./dish')
const Record = db.import('./record')
const Save = db.import('./save')

User.hasMany(Record, { foreignKey: 'user_id' })
Dish.hasMany(Record, { foreignKey: 'dish_id' })

User.hasMany(Save, { foreignKey: 'user_id' })
Food.hasMany(Save, { foreignKey: 'food_id' })

Record.belongsTo(User)
Record.belongsTo(Dish)
Save.belongsTo(User)
Save.belongsTo(Food)

db.sync()

module.exports = {
  User,
  Food,
  Dish,
  Record,
  Save,
}
