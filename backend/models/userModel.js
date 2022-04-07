const mongoose = require('mongoose')

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    focusDuration: {
      type: Number,
      default: 25
    },
    breakDuration: {
      type: Number,
      default: 5
    },
    docDone: {
      type: Number,
      default: 0
    },
    readingSpeed: {
      type: Number,
      default: 2
    },
    isDark: {
      type: Boolean,
      default: false
    },
    pdfAnno: {
      type: Boolean,
      default: true
    },
    pdfPanel: {
      type: Boolean,
      default: true
    },
    pdfPage: {
      type: Boolean,
      default: true
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('User', userSchema)