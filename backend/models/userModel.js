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
    category: {
      type: String,
      enum: ['admin', 'regular', 'accessibility'],
      required: true,
      default: 'regular',
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('User', userSchema)
