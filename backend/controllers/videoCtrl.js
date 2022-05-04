const asyncHandler = require('express-async-handler')
const axios = require('axios')
const User = require('../models/userModel')
const Video = require('../models/videoModel');
const { scrapeAllComments, getCommentsWithTimestamps } = require('./utils');
const blackRanges = require('./constants')
var getSubtitles = require('youtube-captions-scraper').getSubtitles;

// @desc    Request new video info
// @route   POST /api/youtube
// @access  Private
const addVideo = asyncHandler( async (req, res) => {

  // get video id from the request body
  const { videoID } = req.body

  // =================== Captions ===================

  // scrape captions
  const captions = await getSubtitles({
    videoID: videoID, // youtube video id
  });

  // concatenate captions into one caption string
  caption_string = "";

  for (var i = 0; i < captions.length; i++) {
    caption_string += (captions[i]["text"] + " ")
  }

  // extract keywords from the caption string using IBM's NLP API
  const config = {
    auth: {
      username: "apikey",  
      password: process.env.NLP_APIKEY
    },
    headers: {
      'Content-Type': 'application/json'
    },
  }
  
  const response = await axios.post(process.env.NLP_URL, 
    {
      "text": caption_string,
      "features": {
        "keywords": {
          "emotion": true,
          "sentiment": true,
          "limit": 10
        }
      }
    }, config)
  
  // { text: "XXX", timestamps: ["3:12", "4:15"] }
  transcript_keywords = [];

  for (let i = 0; i < response.data["keywords"].length; i++) {
    keyword_text = response.data["keywords"][i]["text"];
    keyword_timestamps = [];
    
    for (let j = 0; j < captions.length; j++) {
      if (captions[j]["text"].includes(keyword_text)) {
        keyword_timestamps.push(captions[j]["start"]);
      }
    }

    transcript_keywords.push({ text: keyword_text, timestamps: keyword_timestamps });
  }

  // =================== Comments ===================
  var commentObjects = [];

  // TO SOLVE LATER: right now it seems that the API is only extracting comments that were left after a certain time

  await scrapeAllComments(commentObjects, videoID);
  var commentsWithTimestamps = getCommentsWithTimestamps(commentObjects);
  console.log("comments scraped")

  // =================== Save to database ===================
  const video = Video({
    videoId: videoID,
    ccKeywords: transcript_keywords,
    comments: commentsWithTimestamps,
    blackRanges, 
    status: 'available',
  })

  await video.save()
  console.log("saved")
  res.status(200).json("done");
})

// @desc    Get one video info
// @route   GET /api/youtube/:id
// @access  Private
const getVideo = asyncHandler( async (req, res) => {
  const video = await Video.find({videoId: req.params.id})
  console.log(video)
  if (video.length == 0) {
    res.status(200).json({status: null})
  }
  res.status(200).json(video)
})

const videoCtrl = {
  addVideo,
  getVideo,
}

module.exports = videoCtrl