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
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('User', userSchema)
