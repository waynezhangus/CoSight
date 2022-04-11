const mongoose = require('mongoose')

const userSchema = mongoose.Schema(
  {
    name: { type: String, trim: true },
    email: { type: String, required: true, unique: true },
    password: String,
    category: {
      type: String,
      enum: ['admin', 'common', 'visual', 'hearing'],
      required: true,
      default: 'common',
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('User', userSchema)
