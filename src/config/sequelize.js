import Sequelize from 'sequelize'

import { SQL_USER, SQL_PASSWORD } from './index'

export const dbConnect = () => {
  return new Sequelize('elephant', SQL_USER, SQL_PASSWORD,
    {
      'dialect': 'mysql',
      'dialectOptions': {
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci',
        supportBigNumbers: true,
        bigNumberStrings: true
      },
      'host': '127.0.0.1',
      'port': 3306,
      'define': {
        'underscored': true // 字段以下划线（_）来分割（默认是驼峰命名风格）
      }
    }
  )
}
