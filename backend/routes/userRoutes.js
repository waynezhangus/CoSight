const express = require('express')
const userCtrl = require('../controllers/userCtrl')
const { protect } = require('../middleware/authMid')

const router = express.Router()

// Register User
router.post('/', userCtrl.registerUser)
// Login User
router.post('/login', userCtrl.loginUser)
// Update user
router.patch('/update', protect, userCtrl.updateUser)

module.exports = router