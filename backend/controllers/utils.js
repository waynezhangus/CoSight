const keyword_extractor = require("keyword-extractor");
const YouTubeComment = require("./YouTubeComment");
const axios = require('axios');

async function scrapeComments(video_id, nextPageToken) {
    var url = `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${video_id}&key=AIzaSyCmf7846pO6TJVkCF5tyvDAhKf4oVTNdQg&maxResults=100`;

    if (nextPageToken != "") {
      url = `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${video_id}&key=AIzaSyCmf7846pO6TJVkCF5tyvDAhKf4oVTNdQg&maxResults=100&pageToken=${nextPageToken}`;
    }

    const config = {
      headers: {
        'Accept': 'application/json'
      },
    }
    
    const response = await axios.get(url, config);

    return response;
}

async function scrapeAllComments(commentObjects, video_id) {
    var nextPageToken = "";
    while (typeof(nextPageToken) != "undefined") {
      const response = await scrapeComments(video_id, nextPageToken);
      // console.log(response);
      const public_comments = response["data"];
      nextPageToken = public_comments["nextPageToken"];
      // res.status(200).json(public_comments);
      // console.log(public_comments);
      for (let i in public_comments["items"]) {
        const originalText = public_comments["items"][i]["snippet"]["topLevelComment"]["snippet"]["textOriginal"];
        const likeCount = public_comments["items"][i]["snippet"]["topLevelComment"]["snippet"]["likeCount"];
        const commentKeywords = keyword_extractor.extract(originalText, {
          language:"english",
          remove_digits: false,
          return_changed_case: false,
          remove_duplicates: true,
          return_chained_words: true
        });
  
        var comment = new YouTubeComment(originalText, likeCount, [], commentKeywords);
        commentObjects.push(comment);
      }
    }
}

// Extract timestamps from a comment
// Assume the videos do not exceed 1 hour
function extractTimestamp(comment) {
    return comment.match(/[0-5]?[0-9]:[0-5][0-9]/g);
}
  
// Extract all comments with timestamps
function getCommentsWithTimestamps(commentObjects) {
    var commentObjectsWithTimestamps = [];
    for (let i in commentObjects) {
      var timestamps = extractTimestamp(commentObjects[i].text);
      if (timestamps != null) {
        commentObjects[i].timestamps = timestamps;
        commentObjectsWithTimestamps.push(commentObjects[i]);
      }
    }
    commentObjectsWithTimestamps.sort((a, b) => (a.likeCount > b.likeCount) ? -1 : 1);
  
    console.log("HEYYYY");
    console.log(commentObjectsWithTimestamps);
    return commentObjectsWithTimestamps;
}

exports.scrapeAllComments = scrapeAllComments;
exports.getCommentsWithTimestamps = getCommentsWithTimestamps;