import express from 'express'
import qiniu from 'qiniu'

import {
  MESSAGE,
  validate,
  QINIU_ACCESS,
  QINIU_SECRET
} from '../config'

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

    return res.json(MESSAGE.OK)
  }
  response()
})

module.exports = router
