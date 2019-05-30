import express from 'express'

import {
  User,
  Record,
  Save,
  Food,
  Dish
} from '../models'

import {
  MESSAGE,
  KEY,
  md5Pwd,
  validate,
  WXP_APPID,
  WXP_SECRET,
} from '../config'

import rp from 'request-promise'

const router = express.Router()

/* users/login */
router.post('/login', (req, res) => {

  // userInfo 可以为空，因为存在用户不同意授权的情况
  // 登录凭证 code 获取 session_key 和 openid
  const { code, userInfo } = req.body
  validate(res, false, code)

  let options = {
    uri: 'https://api.weixin.qq.com/sns/jscode2session',
    qs: {
      appid: WXP_APPID,
      secret: WXP_SECRET,
      js_code: code,
      grant_type: 'authorization_code'
    },
    json: true
  }

  const response = async () => {

    const data = await rp(options)
    console.log(data)
    const { openid } = data

    if (!openid) {
      return res.json(MESSAGE.REQUEST_ERROR)
    }

    let user = await User.findOne({ where: { openid } })

    if (!user) {
      // 如果用户不存在，若是初次登录就替用户注册

      const info = userInfo
      await User.create({
        sex: info.gender === 1 ? 0 : 1, // 微信登录 0未填写 1男 2女
        name: info.nickName,
        openid,
        face: info.avatarUrl
      })

      user = await User.findOne({ where: { openid } })
    }

    const timestamp = Date.now()
    const token = md5Pwd((user.id).toString() + timestamp.toString() + KEY)

    return res.json({
      ...MESSAGE.OK,
      data: {
        user: { ...user.dataValues },
        key: { uid: user.id, token, timestamp },
      }
    })
  }

  response()
})

/* users/info */
router.get('/info', (req, res) => {
  const { uid, timestamp, token } = req.query
  validate(res, true, uid, timestamp, token)

  const response = async () => {

    const data = await User.findOne({
      where: {
        id: uid
      },
      include: [Record, Save]
    })

    return res.json({ ...MESSAGE.OK, data })
  }
  response()
})

/* users/food */
router.get('/food', (req, res) => {
  const { uid, timestamp, token } = req.query
  validate(res, true, uid, timestamp, token)

  const response = async () => {
    const data = await Save.findAll({
      where: {
        user_id: uid,
        exist: 1
      },
      include: [
        {
          model: Food,
          attributes: ['name', 'pic', 'category', 'kw', 'nutrition', 'dishes', 'saveway'],
          include: [{
            model: Dish,
            as: 'dishList'
          }]
        }
      ]
    })

    return res.json({ ...MESSAGE.OK, data })
  }
  response()
})

/* users/finish */
router.post('/finish', (req, res) => {
  const { uid, timestamp, token, food_id } = req.body
  validate(res, true, uid, timestamp, token, food_id)

  const response = async () => {

    await Save.update(
      {
        exist: 0
      },
      {
        where: { food_id }
      }
    )
    return res.json(MESSAGE.OK)
  }
  response()
})

/* users/save */
router.post('/save', (req, res) => {
  const { uid, timestamp, token, food_id, num } = req.body
  validate(res, true, uid, timestamp, token, food_id, num)

  const response = async () => {

    const save = await Save.findOne({
      where: {
        user_id: uid,
        food_id
      }
    })

    if (!save) {
      await Save.create({
        user_id: uid,
        food_id,
        num,
        in_time: Date.now(),
        last_time: -1 // TODO:
      })
    }

    return res.json(MESSAGE.OK)
  }
  response()
})

/* users/dish */
router.get('/dish', (req, res) => {
  const { uid, timestamp, token } = req.query
  validate(res, true, uid, timestamp, token)

  const response = async () => {

    const save = await Save.findAll({
      where: {
        user_id: uid,
        exist: 1
      },
      include: [{
        model: Food,
        include: [{
          model: Dish,
          as: 'dishList',
          include: [{
            model: Food,
            as: 'foodList'
          }]
        }]
      }]
    })

    const foods = await save.map(v => {
      return v.food.dataValues.dishList
    })



    return res.json({ ...MESSAGE.OK, foods })
  }
  response()
})

module.exports = router
