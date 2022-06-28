const mongoose = require('mongoose')

const videoSchema = mongoose.Schema(
  {
    videoId: { type: String, required: true },
    title: String,
    captions: [
      {
        start: Number,
        dur: Number,
        text: String,
        keywords: [String],
      },
    ],
    // the comments with timestamps
    comments: [
      {
        text: String,
        regLike: Number,
        accLike: Number,
        score: Number,
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
          default: "specific visual details not covered by speech",
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
