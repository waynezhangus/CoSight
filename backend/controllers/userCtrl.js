const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../models/userModel')

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  // Validation
  if (!name || !email || !password) {
    res.status(400)
    throw new Error('Please include all fields')
  }
  const userExists = await User.findOne({ email })
  if (userExists) {
    res.status(400)
    throw new Error('User already exists')
  }

  // Create user
  const hashedPassword = await bcrypt.hash(password, 10)
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  })
  if (user) {
    const {
      _id, name, email, focusDuration, breakDuration, readingSpeed,
      isDark, pdfAnno, pdfPanel, pdfPage,
    } = user
    res.status(201).json({
      _id, name, email, focusDuration, breakDuration, readingSpeed,
      isDark, pdfAnno, pdfPanel, pdfPage,
      token: generateToken(_id),
    })
  } else {
    res.status(400)
    throw new error('Invalid user data')
  }
})

// @desc    Login a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  //Validation
  const user = await User.findOne({ email })
  if (user && (await bcrypt.compare(password, user.password))) {
    const {
      _id, name, email, focusDuration, breakDuration, readingSpeed,
      isDark, pdfAnno, pdfPanel, pdfPage,
    } = user
    res.status(200).json({
      _id, name, email, focusDuration, breakDuration, readingSpeed,
      isDark, pdfAnno, pdfPanel, pdfPage,
      token: generateToken(_id),
    })
  } else {
    res.status(401)
    throw new Error('Invalid credentials')
  }
})
// @desc    Update a user
// @route   POST /api/users/update
// @access  Private
const updateUser = asyncHandler(async (req, res) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    req.body,
    { new: true }
  )
  res.status(200).json(updatedUser)
})

// Generate token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_SECRET, {
    expiresIn: '30d',
  })
}

const userCtrl = {
  registerUser,
  loginUser,
  updateUser,
}

module.exports = userCtrl