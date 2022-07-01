const getSubtitles = require('youtube-captions-scraper').getSubtitles;
const keyword_extractor = require("keyword-extractor");
const axios = require('axios');
const Video = require('../models/videoModel');

const HFSwitch = true
const keywordOptions = {
  language:"english",
  remove_digits: true,
  return_changed_case: true,
  remove_duplicates: true,
  return_chained_words: false
}
let captionString = ''

async function getTitle(videoId) {
  const config = {
    headers: {
      'Accept': 'application/json'
    },
    params: {
      key: process.env.YT_APIKEY,
      part: 'snippet',
      id: videoId,
    }
  }
  const response = await axios.get(process.env.YT_VID_URL, config);
  return response.data['items'][0]['snippet']['title']
}

async function getCaptions(videoId) {
  let captions = await getSubtitles({ videoID: videoId });
  captionString = captions.reduce((sum, cur) => sum + cur['text'], '');
  captionString = captionString.replace(/(\r\n|\n|\r)/gm, "");

  captions = captions.map(caption => ({
    ...caption,
    keywords: keyword_extractor.extract(caption.text, keywordOptions),
  }))

  return captions;
}

async function getComments(videoId) {

  let nextPageToken = null;
  let allComments = [];
  do {
    const config = {
      headers: {
        'Accept': 'application/json'
      },
      params: {
        key: process.env.YT_APIKEY,
        part: 'snippet',
        videoId,
        maxResults: 100,
        pageToken: nextPageToken,
      }
    }
    let response
    try {
      response = await axios.get(process.env.YT_COM_URL, config);
    } catch (error) {
      throw new Error(error);
    }
    nextPageToken = response.data['nextPageToken'];
    commentPage = response.data['items'].map(item => item["snippet"]["topLevelComment"]["snippet"])
    allComments = [...allComments, ...commentPage];
  } while (typeof(nextPageToken) != "undefined");
  
  allComments = allComments.map(comment => ({
    text: comment['textOriginal'],
    regLike: comment['likeCount'],
    timestamps: comment['textOriginal'].match(/\b[0-5]?\d:[0-5]\d\b/g),
  }))

  let commentsTimed = allComments.filter(comment => Boolean(comment['timestamps']))
  
  commentsTimed = commentsTimed.map(comment => ({
    ...comment,
    accLike: 0,
    keywords: keyword_extractor.extract(comment.text, keywordOptions),
  }))

  const payload = commentsTimed.map(comment => comment.text)

  let response
  if (HFSwitch) {
    try {
      const config = {
        headers: { Authorization: `Bearer ${process.env.HF_TOKEN}` }
      };
      const body = {
        inputs: {
          source_sentence: captionString,
          sentences: payload,
        }
      }
      response = await axios.post(process.env.HF_URL, body, config)
    } catch (error) {
      throw new Error(error);
    }
  }

  commentsTimed = commentsTimed.map((comment, index) => ({
    ...comment,
    score: response.data[index]
  }))

  const video = await Video.findOne({ videoId })
  if (video) {
    const prevComments = video.comments
    commentsTimed.forEach(comment => {
      prev = prevComments.find(prevComment => prevComment.text == comment.text)
      comment.accLike = prev?.accLike ?? 0
    })
  }

  commentsTimed.sort((a, b) => (b.regLike - a.regLike))
  return commentsTimed
}

module.exports = { 
  getTitle,
  getCaptions,
  getComments
}