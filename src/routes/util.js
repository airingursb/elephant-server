import express from 'express'
import qiniu from 'qiniu'

import {
  MESSAGE,
  validate,
  QINIU_ACCESS,
  QINIU_SECRET
} from '../config'

import { Food } from '../models'

import rp from 'request-promise'

const router = express.Router()

qiniu.conf.ACCESS_KEY = QINIU_ACCESS
qiniu.conf.SECRET_KEY = QINIU_SECRET

/* utils/qiniu_token */
router.get('/qiniu_token', (req, res) => {

  const {
    uid,
    timestamp,
    token,
    filename
  } = req.query
  validate(res, true, uid, timestamp, token, filename)

  const putPolicy = new qiniu.rs.PutPolicy(BUCKET + ':' + filename)
  const data = putPolicy.token()

  return res.json({
    ...MESSAGE.OK,
    data
  })
})

/* utils/what_food */
router.get('/what_food', (req, res) => {
  const { uid, timestamp, token, url } = req.query
  validate(res, true, uid, timestamp, token, url)

  const response = async () => {

    let options = {
      uri: 'http://118.24.158.234/image-predict',
      method: 'POST',
      body: {
        image_url: url,
        key: 'd0977d7dcb6b4620a2391c349d7e2eb1',
      },
      json: true
    }

    const result = await rp(options)
    const { data } = result
    console.log(result)
    console.log(data)
    const food = await Food.findOne({ where: { name: data.name || '' } })
    return res.json({ ...MESSAGE.OK, data: food && [food] || [data] })
  }
  response()
})

router.get('/get_food_by_name', (req, res) => { 
  const { uid, timestamp, token, name } = req.query
  validate(res, true, uid, timestamp, token, name)

  const response = async () => {
    const data = await Food.findOne({ where: { name } })
    return res.json({ ...MESSAGE.OK, data })
  }

  response()
})

module.exports = router
