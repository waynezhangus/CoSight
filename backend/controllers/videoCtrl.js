const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const Video = require('../models/videoModel');
const blackRanges = require('./constants');
const { getCCKeywords, getComments } = require('./api');

// @desc    Request new video info
// @route   POST /api/youtube
// @access  Private
const addVideo = asyncHandler( async (req, res) => {

  const { videoId } = req.body;
  const ccKeywords = await getCCKeywords(videoId)
  const comments = await getComments(videoId)

  const video = Video({
    videoId,
    ccKeywords,
    comments,
    blackRanges, 
    status: 'available',
  })

  await video.save()
  res.status(201).json(video);
})

// @desc    Get one video info
// @route   GET /api/youtube/:id
// @access  Private
const getVideo = asyncHandler( async (req, res) => {
  const video = await Video.find({videoId: req.params.id})
  if (video.length == 0) {
    res.status(404)
    throw new Error('Video not found')
  } 
  res.status(200).json(video[video.length - 1])
})

const videoCtrl = {
  addVideo,
  getVideo,
}

module.exports = videoCtrl