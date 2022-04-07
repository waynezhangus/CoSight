const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')

const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization
  const token = authHeader?.split(' ')[1]

  if (!token) {
    res.status(401)
    throw new Error('Token not found')
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET)
    req.user = await User.findById(decoded.id).select('id')
    next()
  } catch (error) {
    console.log(error)
    res.status(401)
    throw new Error('Not authorized')
  }
})

module.exports = { protect }
