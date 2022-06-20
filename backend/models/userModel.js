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
    statistics: [
      {
        videoId: String,
        userComments: [String],
        iconClicked: Number,
        iconStamp: [String],
      },
    ],
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('User', userSchema)
