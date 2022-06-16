const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const Video = require('../models/videoModel');
const videosRanges = require('./constants');
const { getCCKeywords, getComments } = require('./api');

// @desc    Request new video info
// @route   POST /api/youtube
// @access  Private
const addVideo = asyncHandler( async (req, res) => {
  const { videoId } = req.body;
  const ccKeywords = await getCCKeywords(videoId);
  const comments = await getComments(videoId);
  const blackRanges = videosRanges[videoId] ?? [];

  const video = await Video.findOne({videoId: videoId})
  if (!video) {
    const videoNew = Video({
      videoId,
      ccKeywords,
      comments,
      blackRanges, 
      status: 'available',
    })
    videoNew.save()
    res.status(201).json(videoNew);
  } else {
    video.ccKeywords = ccKeywords;
    video.comments = comments;
    video.blackRanges = blackRanges;
    video.save()
    res.status(200).json(video);
  }
})

// @desc    Get one video info
// @route   GET /api/youtube/:id
// @access  Private
const getVideo = asyncHandler( async (req, res) => {
  const video = await Video.findOne({videoId: req.params.id})
  if (!video) {
    res.status(404);
    throw new Error('Video not found');
  } else {
    res.status(200).json(video);
  }
})

const videoCtrl = {
  addVideo,
  getVideo,
}

module.exports = videoCtrl