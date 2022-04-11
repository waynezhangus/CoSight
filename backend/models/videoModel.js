const mongoose = require('mongoose')

const docSchema = mongoose.Schema(
  {
    videoId: { type: String, required: true },
    ccKeywords: [
      {
        text: String,
        timestamps: [String],
      },
    ],
    comments: [
      {
        text: String,
        likeCount: Number,
        keywords: [String],
        timestamps: [String],
      },
    ],
    blackRanges: [
      {
        start: Number,
        end: Number,
        hasVisited: Boolean,
      },
    ],
    status: {
      type: String,
      enum: ['null', 'processing', 'available'],
      default: 'null',
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Doc', docSchema)
