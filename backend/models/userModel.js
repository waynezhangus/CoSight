const mongoose = require('mongoose')

const userSchema = mongoose.Schema(
  {
    name: { 
      type: String, 
      trim: true 
    },
    email: { 
      type: String, 
      required: true, 
      unique: true 
    },
    password: String,
    mode: {
      type: Boolean,
      required: true,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    pauseEnable: {
      type: Boolean,
      default: false,
    },
    visitedEnable: {
      type: Boolean,
      default: false,
    },
    statistics: [
      {
        videoId: String,
        title: String,
        userComments: [String],
        iconStamps: [String],
      },
    ],
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('User', userSchema)
