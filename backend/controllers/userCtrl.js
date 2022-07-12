const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const XLSX = require('xlsx')

const User = require('../models/userModel')

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const {name, email, password} = req.body

  // Validation
  if (!email || !password) {
    res.status(400)
    throw new Error('More information needed')
  }
  const nameExists = await User.findOne({name})
  const emailExists = await User.findOne({email})
  if (nameExists || emailExists) {
    res.status(400)
    throw new Error('User already exists')
  }

  // Create user
  const hashedPassword = await bcrypt.hash(password, 10)
  const user = new User({
    name,
    email,
    password: hashedPassword,
  })
  try {
    user.save()
  } catch (err) {
    res.status(400)
    throw new error(err)
  }
  const resObj = {
    ...user._doc,
    token: generateToken(user._id),
  }
  delete resObj.password
  res.status(201).json(resObj)
})

// @desc    Login a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const {email, password} = req.body

  //Validation
  const user = await User.findOne({email})
  if (user && (await bcrypt.compare(password, user.password))) {
    const resObj = {
      ...user._doc,
      token: generateToken(user._id),
    }
    const omit = ['createdAt', 'updatedAt', '__v', 'password']
    omit.forEach((e) => delete resObj[e])
    res.status(200).json(resObj)
  } else {
    res.status(401)
    throw new Error('Wrong email or password')
  }
})
// @desc    Update a user
// @route   PATCH /api/users/update
// @access  Private
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.user.id, req.body, {new: true})
  const resObj = {
    ...user._doc,
    token: generateToken(user._id),
  }
  const omit = ['createdAt', 'updatedAt', '__v', 'password']
  omit.forEach((e) => delete resObj[e])
  res.status(200).json(resObj)
})
// @desc    Get user comments
// @route   GET /api/users/comments
// @access  Public
const userComments = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('statistics')
  let result = []
  users.forEach((user) => {
    user.statistics.forEach((video) => {
      video.userComments.forEach((comment) => {
        const timestamp = comment.match(/\b[0-5]?\d:[0-5]\d\b/g)
        result.push({
          userId: user._id,
          videoId: video.videoId,
          videoTitle: video.title,
          userComment: comment,
          timeString: timestamp?.reduce(
            (sum, current) => sum + current + ', ',
            ''
          ),
          timeSecond:
            timestamp &&
            parseInt(timestamp[0].split(':')[0]) * 60 +
              parseInt(timestamp[0].split(':')[1]),
        })
      })
    })
  })

  result.sort((a, b) => (a.timeSecond ?? 0) - (b.timeSecond ?? 0))

  const worksheet = XLSX.utils.json_to_sheet(result)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'test')

  XLSX.writeFile(workbook, 'test.xlsx')

  // console.log(result)
  res.status(200).json(result)
})

// Generate token
const generateToken = (id) => {
  return jwt.sign({id}, process.env.TOKEN_SECRET, {
    expiresIn: '30d',
  })
}

const userCtrl = {
  registerUser,
  loginUser,
  updateUser,
  userComments,
}

module.exports = userCtrl
