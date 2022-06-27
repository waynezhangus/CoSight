const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL)
    if (process.env.NODE_ENV === 'development') {
      console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline)
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`Error: ${error.message}`.red.underline.bold)
    }
    process.exit(1)
  }
}

module.exports = connectDB
