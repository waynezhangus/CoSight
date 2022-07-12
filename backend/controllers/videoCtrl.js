const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const Video = require('../models/videoModel')
const videosRanges = require('./constants')
const {getTitle, getCaptions, getComments} = require('./api')

// @desc    Request new video info
// @route   POST /api/youtube
// @access  Public
const addVideo = asyncHandler(async (req, res) => {
  const {videoId} = req.body
  const blackRanges = videosRanges[videoId] ?? []
  if (blackRanges == []) {
    res.status(404).json('message: video not tested')
    return null
  }
  const title = await getTitle(videoId)
  const captions = await getCaptions(videoId)
  const comments = await getComments(videoId)
  console.log('comments')

  const filter = {videoId}
  const update = {
    title,
    captions,
    comments,
    blackRanges,
    status: 'available',
  }
  const options = {
    upsert: true,
    new: true,
    setDefaultsOnInsert: true,
  }

  const video = await Video.findOneAndUpdate(filter, update, options)
  res.status(200).json(video)
})

// @desc    Get one video info
// @route   GET /api/youtube/:id
// @access  Public
const getVideo = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('statistics')
  const video = await Video.findOne({videoId: req.params.id})
  if (!video) {
    res.status(404)
    throw new Error('Video not found')
  } else {
    if (false) {
      res.status(200).json(video)
    } else {
      const userComments = []
      users.forEach((user) => {
        const userData = user.statistics.find(
          (video) => video.videoId == req.params.id
        )
        if (userData?.userComments) userComments.push(...userData.userComments)
      })
      const newComments = []
      video.comments.forEach((comment) => {
        if (userComments.find((userComment) => userComment == comment.text)) {
          newComments.push(comment)
        }
      })
      video.comments = newComments
      res.status(200).json(video)
    }
  }
})

// @desc    Update comment like count
// @route   PATCH /api/youtube/:id/comment/vote
// @access  Public
const commentVote = asyncHandler(async (req, res) => {
  const {commentId, payload} = req.body
  const video = await Video.findOneAndUpdate(
    {videoId: req.params.id},
    {$inc: {'comments.$[comment].accLike': payload}},
    {new: true, arrayFilters: [{'comment._id': commentId}]}
  )
  if (!video) {
    res.status(404)
    throw new Error('Video not found')
  } else {
    res.status(200).json(video)
  }
})

const videoCtrl = {
  addVideo,
  getVideo,
  commentVote,
}

module.exports = videoCtrl
