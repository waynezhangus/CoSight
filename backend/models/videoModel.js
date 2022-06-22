const mongoose = require('mongoose')

const videoSchema = mongoose.Schema(
  {
    videoId: { type: String, required: true },
    title: String,
    ccKeywords: [
      {
        text: String,
        timestamps: [String],
      },
    ],
    // the comments with timestamps
    comments: [
      {
        text: String,
        regLike: Number,
        accLike: Number,
        timestamps: [String],
        keywords: [String],
      },
    ],
    blackRanges: [
      {
        start: Number,
        end: Number,
        score: Number,
        hasVisited: {
          type: Boolean,
          default: false,
        },
        reason: {
          type: String,
          default: "mismatch between video and audio",
        },
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

module.exports = mongoose.model('Video', videoSchema)
