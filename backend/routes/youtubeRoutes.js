const express = require('express')
const videoCtrl = require('../controllers/videoCtrl')
//const { protect } = require('../middleware/authMid')

const router = express.Router()

router.route('/')
  .post(videoCtrl.addVideo)

router.route('/:id')
  .get(videoCtrl.getVideo)

module.exports = router
