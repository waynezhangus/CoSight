import { getVideo, addVideo } from '../background/api'
import { getVideoId, waitForPromise } from './utils'
import { createFloatCard, deleteFloatCard, readComments, createEasyStartCard } from './components'

// Get the id of the current Youtube video
const video_id = getVideoId(window.location.href);

let mode = true;

getVideo(video_id).then((videoData) => {

  //console.log(videoData)

  const videoSeg = videoData.blackRanges.filter(({score}) => score > 0.5);
  console.log(videoSeg);
  let commentsTimed = videoData.comments
  let commentsToDisplay = videoData.comments.slice(0, 5);
  let ccKeywords = videoData.ccKeywords


  const video = document.querySelector('.html5-video-player').querySelector('video');
  console.log(video);

  let prevSeg = undefined;

  let isSeeking = false;

  video.onseeking = () => {
    console.log("onseeking")
    isSeeking = true;
  }

  video.ontimeupdate = () => {
    console.log("ontimeupdate")
    let curTime = video.currentTime;
    let curSeg = videoSeg.find(({ start, end }) => {
      return (start <= curTime) && (curTime < end);
    });

    // when the user is moving/skipping to a new timestamp
    if (isSeeking) {
      prevSeg = curSeg;
      isSeeking = false;
      return;
    }
    //console.log(curSeg)
    if (!mode) {
      if (curSeg != prevSeg) {
        if (!prevSeg) {
          if (!curSeg.hasVisited) {
            createFloatCard(curSeg);
            curSeg.hasVisited = true;
          }     
        } else if (!curSeg) {
          deleteFloatCard();
        } else {
          deleteFloatCard();
          if (!curSeg.hasVisited) {
            createFloatCard(curSeg);
            curSeg.hasVisited = true;
          } 
        }
      }
    } else {
      if (curSeg != prevSeg) {
        if (!prevSeg) {
    
        } else if (!curSeg) {
          //deleteFloatCard();
          if (!prevSeg.hasVisited) {
            readComments(commentsTimed, prevSeg);
            prevSeg.hasVisited = true;
          }
        } else {
          //deleteFloatCard(); 
          if (!prevSeg.hasVisited) {
            readComments(commentsTimed, prevSeg);
            prevSeg.hasVisited = true;
          }
        }
      }
    }
    prevSeg = curSeg;
  }

  function calculatePercentage(timeStamp, totalTime) {
    // CHANGE LATER
    console.log(timeStamp / totalTime)
    return timeStamp / totalTime
  }

  function convertToSecond(timestamp_string) {
    const min_second_arr = timestamp_string.split(':')
    return parseInt(min_second_arr[0]) * 60 + parseInt(min_second_arr[1])
  }

  function convertToMinSecond(timestamp_string) {
    console.log(timestamp_string)
    var timestamp_float = parseFloat(timestamp_string)
    var minutes = Math.floor(timestamp_float / 60)
    var seconds = Math.round(timestamp_float - minutes * 60)
    return String(minutes) + ':' + String(seconds)
  }

  var comments;
  var box;

  let observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (!mutation.addedNodes) return

      for (let i = 0; i < mutation.addedNodes.length; i++) {
        // do things to your newly added nodes here
        let node = mutation.addedNodes[i]

        if (node['id'] === 'contenteditable-root') {
          console.log("I AM HERE!!");
          createEasyStartCard(commentsToDisplay);
          var comment = document.getElementById('contenteditable-root')

          console.log(node)
          node['ariaLabel'] =
            'What images are the most significant to the understanding and appreciation of the video?'
          // node.classList.push()
          comment.onkeypress = function (e) {
            console.log('key pressed!')
            console.log(comment.textContent)

            // Many edge cases here
            // Just consider one keyword case for now
            // Assume the comment only contains one keyword
            // Match transcript keywords with the comment the user is writing
            for (let i in ccKeywords) {
              if (comment.textContent.includes(ccKeywords[i]['text'])) {
                box.innerHTML = `<div style="font-size: 130%">Add a time stamp ...</div>
                <div style="margin-top: 3%;margin-left: 3%;margin-right: 3%;">
                    <div style="margin-bottom: 2%;">suggested: Are you talking about&nbsp;&nbsp;<div id="timestamps"></div>?</div>
                </div>`
                // var timestamp_string = "";
                for (let j in ccKeywords[i]['timestamps']) {
                  // timestamp_string += (keywords[i]["timestamps"][j] + ", ");
                  var timestamp = document.createElement('SPAN')
                  timestamp.setAttribute('style', 'color: blue;')
                  // timestamp.id = keywords[i]["timestamps"][j];
                  timestamp.innerHTML =
                    convertToMinSecond(ccKeywords[i]['timestamps'][j]) + ' '
                  timestamp.onclick = function (e) {
                    // if (comment.textContent.substring(0, 5) !== "7:27 ") {
                    //   comment.textContent = "7:27 " + comment.textContent;
                    // }
                    comment.textContent =
                      convertToMinSecond(ccKeywords[i]['timestamps'][j]) +
                      ' ' +
                      comment.textContent
                    const youtubeVideo = <HTMLVideoElement>(
                      document.getElementsByTagName('Video')[0]
                    )
                    window.scrollTo(0, 0)
                    youtubeVideo.currentTime = parseFloat(
                      ccKeywords[i]['timestamps'][j]
                    )
                    youtubeVideo.play()
                  }
                  document.getElementById('timestamps').appendChild(timestamp)
                }
              }
            }

            var matched_comments = []
            for (let i in commentsTimed) {
              for (let j in commentsTimed[i].keywords) {
                if (
                  comment.textContent.includes(
                    commentsTimed[i].keywords[j]
                  )
                ) {
                  matched_comments.push(commentsTimed[i])
                }
              }
            }

            console.log(matched_comments)
            if (matched_comments.length != 0) {
              box.innerHTML = `<div style="font-size: 130%">Add a time stamp ...</div>
                <div style="margin-top: 3%;margin-left: 3%;margin-right: 3%;">
                    <div style="margin-bottom: 2%;">suggested: Are you talking about&nbsp;&nbsp;<div id="timestamps"></div>?</div>
                    <div id="sources"></div>
                </div>`

              for (let i in matched_comments) {
                var timestamp = document.createElement('SPAN')
                timestamp.setAttribute('style', 'color: blue;')
                timestamp.innerHTML = matched_comments[i].timestamps[0] + ' '
                timestamp.onclick = function (e) {
                  comment.textContent =
                    matched_comments[i].timestamps[0] +
                    ' ' +
                    comment.textContent
                  const youtubeVideo = <HTMLVideoElement>(
                    document.getElementsByTagName('Video')[0]
                  )
                  window.scrollTo(0, 0)
                  youtubeVideo.currentTime = convertToSecond(
                    matched_comments[i].timestamps[0]
                  )
                  youtubeVideo.play()
                }
                document.getElementById('timestamps').appendChild(timestamp)

                var sourceComment = document.createElement('DIV')
                sourceComment.innerHTML = matched_comments[i].text
                document.getElementById('sources').appendChild(sourceComment)
              }
            }

            if (comment.textContent === 'Why is the bipolar neuron upset') {
              box.innerHTML = `<div style="font-size: 130%">Add a time stamp ...</div>
                <div style="margin-top: 3%;margin-left: 3%;margin-right: 3%;">
                    <div style="margin-bottom: 2%;">suggested: Are you talking about&nbsp;&nbsp;<span id="timestamp_1" style="color: blue;text-decoration: underline;">7:27</span>?</div>
                </div>`
            }
            if (comment.textContent === 'The leg shake is') {
              box.innerHTML = `<div style="font-size: 130%">Add a time stamp ...</div>
                <div style="margin-top: 3%;margin-left: 3%;margin-right: 3%;">
                    <div style="margin-bottom: 2%;">suggested: Are you talking about&nbsp;&nbsp;<span id="timestamp_2" style="color: blue;text-decoration: underline;">3:18</span>?</div>
                    <div><span style="color: blue;text-decoration: underline;">3:18</span>&nbsp;&nbsp;that little leg shake ...</div>
                </div>`
            }
            if (comment.textContent === 'You make it so easy to learn') {
              box.innerHTML = `<div style="font-size: 130%">Your clarification does help ...</div>
                <div style="margin-top: 3%;margin-left: 3%;margin-right: 3%;">
                    <div style="margin-bottom: 2%;">suggested: use concrete words</div>
                    <div style="color: grey;">what is "it" in this part of the comment?</div>
                </div>`
            }

            const timestamp_1 = document.getElementById('timestamp_1')
            if (timestamp_1) {
              timestamp_1.onclick = function (e) {
                if (comment.textContent.substring(0, 5) !== '7:27 ') {
                  comment.textContent = '7:27 ' + comment.textContent
                }
                const youtubeVideo = <HTMLVideoElement>(
                  document.getElementsByTagName('Video')[0]
                )
                window.scrollTo(0, 0)
                youtubeVideo.currentTime = 447
                youtubeVideo.play()
              }
            }

            const timestamp_2 = document.getElementById('timestamp_2')
            if (timestamp_2) {
              timestamp_2.onclick = function (e) {
                if (comment.textContent.substring(0, 5) !== '3:18 ') {
                  comment.textContent = '3:18 ' + comment.textContent
                }
                const youtubeVideo = <HTMLVideoElement>(
                  document.getElementsByTagName('Video')[0]
                )
                window.scrollTo(0, 0)
                youtubeVideo.currentTime = 198
                youtubeVideo.play()
              }
            }
          }
        }

        // do we need id?
        if (
          node['id'] === 'sections' &&
          node['className'] === 'style-scope ytd-comments'
        ) {
          comments = node
          console.log(node)
        }
      }
    })
  })

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    characterData: false,
  })
})

// ======================== unused code ========================
// function domReady(callback) {
//   if (document.readyState === "complete") {
//     callback()
//   } else {
//     window.addEventListener("load", callback, {
//       once: true,
//     })
//   }
// }

// domReady(() => {
//   getVideo(video_id).then((video) => {
//     ccKeywords = video.ccKeywords;
//     commentsWithTimestamps = video.comments;
//     blackRanges = video.blackRanges;
//     console.log(video);
//   })
// })

// function waitFor(selector: string, callback, timeout?: number) {
//   const element = document.querySelector(selector);
//   if (element) {
//     callback(element)
//   } else {
//     if (timeout) {
//       return window.setTimeout(() => {
//         return window.requestAnimationFrame(() => {
//           waitFor(selector, callback)
//         });
//       }, timeout)
//     }
//     return window.requestAnimationFrame(() => {
//       waitFor(selector, callback)
//     })
//   }
// }



// Dependencies
// import { scrapeAllComments, scrapeCaptions, getCommentsWithTimestamps, postData } from "./utils";
// import { timeRangeType } from "./timeRange";
// import { text_on_screen_keywords } from "./constants";
// import { timeRangeArr } from "./constants";

// const response = async() => {
//   await getVideo(video_id);
// };

// console.log(response);

// var captions = [];

// Scrape YouTube Comments

// var xhr = new XMLHttpRequest();
// xhr.responseType = 'json';
// var commentObjects = [];

/*
scrapeAllComments(commentObjects, video_id).then(() => {
  console.log("Comments Scraped!!!");
  console.log(commentObjects);
  commentsWithTimestamps = getCommentsWithTimestamps(commentObjects);
  commentsToDisplay = commentsWithTimestamps.slice(0, 5);
})
*/

/*
// Get keywords using IBM's api
scrapeCaptions(video_id, captions).then((caption_string) => {
    console.log(captions);
    console.log(caption_string);
    postData('https://api.us-east.natural-language-understanding.watson.cloud.ibm.com/instances/db9da5ba-bf8c-444e-b64a-ffdc988b0407/v1/analyze?version=2021-08-01', {
      text: caption_string,
      features: {
        keywords: {
          emotion: true,
          sentiment: true,
          limit: 10
        }
      }
    })
    .then(data => {
      // JSON data parsed by `data.json()` call
      keywords = data["keywords"];
      for (let i in keywords) {
        keywords[i]["timestamps"] = [];
        for (let j in captions) {
          if (captions[j]["text"].includes(keywords[i]["text"])) {
            keywords[i]["timestamps"].push(captions[j]["start"]);
          }
        }
      }
      console.log('KEYWORDS!!');
      console.log(keywords);
    });
})
*/




//   if (!document.querySelector('#my-cool-node') && comments) {

//     console.log(comments);
//     var box = document.createElement("DIV");
//     box.style = "background-color: rgb(229, 229, 229); width: 35%; height: 80%; padding: 1.5%; margin-top: -2%; margin-bottom: 2%; border-radius: 5%;";
//     box.id = 'my-cool-node';
//     box.innerHTML = `<div style="font-size: 130%;">Easy Start</div>
//     <div style="margin: 3%;">
//         <span>__looks like__&nbsp;&nbsp;</span>
//         <span>The color of __ is __</span>
//         <br>
//         <span>The __ is __</span>
//     </div>
//   <div style="font-size: 130%">See what others are talking about ...</div>
//     <div style="margin-top: 3%;margin-left: 3%;margin-right: 3%;">
//         <div><span style="color: blue;text-decoration: underline;">01:36</span>&nbsp;&nbsp;the graphical representation ...</div>
//         <div><span style="color: blue;text-decoration: underline;">04:47</span>&nbsp;&nbsp;that cartoon of cells ...</div>
//         <div><span style="color: blue;text-decoration: underline;">06:01</span>&nbsp;&nbsp;the man looks like ...</div>
//     </div>`;
//     comments.childNodes[1].appendChild(box);
//   }
// }

// if (!box.innerHTML) {
//   box.innerHTML = `<div style="font-size: 130%">Add a time stamp ...</div>
// <div style="margin-top: 3%;margin-left: 3%;margin-right: 3%;">
//     <div style="margin-bottom: 2%;">suggested: Are you talking about&nbsp;&nbsp;<span style="color: blue;text-decoration: underline;">06:22</span>?</div>
//     <div><span style="color: blue;text-decoration: underline;">06:22</span>&nbsp;&nbsp;that bottle looks like ...</div>
// </div>`;
// }

// console.log('The ' + mutation.attributeName + ' attribute was modified.');
// console.log(progressBar["style"].transform);

// if (parseFloat(progressBar["style"].transform.substring(7)) > 0.1084 &&
//     parseFloat(progressBar["style"].transform.substring(7)) < 0.123 && videoContainer.childElementCount == 1) {
//       videoContainer.appendChild(floatCard);
//       const goButton = document.getElementById("go-button");
//       goButton.onclick = function(e) {
//         window.scrollTo(0, 1150);
//       }
// }
// if ((parseFloat(progressBar["style"].transform.substring(7)) <= 0.1084 ||
//     parseFloat(progressBar["style"].transform.substring(7)) >= 0.123) && videoContainer.childElementCount == 2) {
//       videoContainer.removeChild(floatCard);
// }
// if (parseFloat(progressBar["style"].transform.substring(7)) > calculatePercentage(45.5) &&
//     parseFloat(progressBar["style"].transform.substring(7)) < calculatePercentage(57) && videoContainer.childElementCount == 1) {
//       videoContainer.appendChild(floatCard);
//       const goButton = document.getElementById("go-button");
//       goButton.onclick = function(e) {
//         window.scrollTo(0, 1150);
//       }
// }
// if ((parseFloat(progressBar["style"].transform.substring(7)) <= calculatePercentage(45.5) ||
//     parseFloat(progressBar["style"].transform.substring(7)) >= calculatePercentage(57)) && videoContainer.childElementCount == 2) {
//       videoContainer.removeChild(floatCard);
// }
