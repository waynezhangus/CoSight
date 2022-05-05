import {
  getVideo,
  addVideo,
} from '../background/api' 

function domReady(callback) {
  if (document.readyState === "complete") {
    callback()
  } else {
    window.addEventListener("load", callback, {
      once: true,
    })
  }
}

// Get the id of a Youtube video
var index = location.href.indexOf('=');
const video_id = location.href.substr(index+1, 11);



// domReady(() => {
//   getVideo(video_id).then((video) => {
//     ccKeywords = video.ccKeywords;
//     commentsWithTimestamps = video.comments;
//     blackRanges = video.blackRanges;
//     console.log(video);
//   })
// })


getVideo(video_id).then((video) => {
  let ccKeywords = video.ccKeywords;
  let commentsWithTimestamps = video.comments;
  let newBlackRanges = [];
  
  for (let i = 0; i < video.blackRanges.length; i++) {
    if (video.blackRanges[i].score > 0.5)
      newBlackRanges.push({start: Math.trunc(video.blackRanges[i].start), end: Math.trunc(video.blackRanges[i].end), score: video.blackRanges[i].score, hasVisited: false})
  }

let commentsToDisplay = commentsWithTimestamps.slice(0, 5);

console.log("commentsToDisplay");
console.log(commentsToDisplay);

function waitFor(selector: string, callback, timeout?: number) {
  const element = document.querySelector(selector);
  if (element) {
    callback(element)
  } else {
    if (timeout) {
      return window.setTimeout(() => {
        return window.requestAnimationFrame(() => {
          waitFor(selector, callback)
        });
      }, timeout)
    }
    return window.requestAnimationFrame(() => {
      waitFor(selector, callback)
    })
  }
}

function waitForPromise(selector: string, parent: Element) {
  return new Promise(resolve => {
    let target = parent.querySelector(selector)
    if(target) {
      resolve(target)
    } else {
      const observer = new MutationObserver(mutations => {
      target = parent.querySelector(selector)
      if(target) {
        resolve(target)
        observer.disconnect()
      }
      })
      observer.observe(parent, {
        childList: true,  subtree: true
      })
    }
  })
}

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

// var progressBar = document.getElementsByClassName("ytp-play-progress ytp-swatch-background-color");
// console.log(progressBar[0]["style"].cssText);
// console.log("!!!!");
// console.log(progressBar);

// observe the progress bar

// Select the node that will be observed for mutations
// const progressBar = document.getElementsByClassName("ytp-play-progress ytp-swatch-background-color")[0];
const progressBar = document.getElementsByClassName('ytp-progress-bar')[0];

// Options for the observer (which mutations to observe)
const config = { attributes: true, childList: true, subtree: true };

// Callback function to execute when mutations are observed
var videoContainer = document.getElementsByClassName("html5-video-container")[0];
var floatCard;
floatCard = document.createElement("DIV"); 
floatCard.id = "float-card";
floatCard.setAttribute('style', 'position: absolute; z-index: 2; height: 9em; width: 15%; margin-top: 45%; margin-left: 3%; padding-right: 1%; padding-left: 1%; background-color: #E5E5E5; border-radius: 0.5em;');
// floatCard.class = 'overlay';             
floatCard.innerHTML = `<p style="color: #000000; margin-left: 8%; margin-top: 10%;">Write a quick comment on <br> what you see to help people!</p>
<p style="color: #000000; margin-left: 8%; margin-top: 8%;" id="source-text"></p>
<button style="font-size: 12px; margin-left: 78%; margin-top: 2%" id="go-button">Go</button>`; 

function calculatePercentage(timeStamp, totalTime) {
  // CHANGE LATER
  console.log(timeStamp / totalTime);
  return timeStamp / totalTime;
}

function sort_object(obj) {
  var items = Object.keys(obj).map(function(key) {
      return [key, obj[key]];
  });
  items.sort(function(first, second) {
      return second[1] - first[1];
  });
  var sorted_obj={}
  items.forEach(function(k, v) {
      var use_key = v[0]
      var use_value = v[1]
      sorted_obj[use_key] = use_value
  })
  return(sorted_obj)
} 

const callback = function(mutationsList, observer) {
    // Use traditional 'for loops' for IE 11
    for(const mutation of mutationsList) {
        if (mutation.type === 'childList') {
            console.log('A child node has been added or removed.');
        }
        else if (mutation.type === 'attributes') {
          switch(mutation.attributeName) {
            case "aria-valuenow":
              console.log('The ' + mutation.attributeName + ' attribute was modified.');
              console.log(mutation.oldValue);
              var showFloatCard = false;
              // var timeStampArr;

              // if (current_url == 'qPix_X-9t7E') {
              //   timeStampArr = timeStampArr1;
              // }

              // if (current_url == 'W0TM4LQmoZY') {
              //   timeStampArr = timeStampArr2;
              // }
              // console.log(timeStampArr);
              for (let i in newBlackRanges) {
                // EDGE CASE: one segment follows another but they have different types
                // progressBar["style"].transform.substring(7)
                if (parseInt(progressBar['ariaValueNow']) >= newBlackRanges[i].start &&
                  parseInt(progressBar['ariaValueNow']) <= newBlackRanges[i].end) {
                    if (parseInt(progressBar['ariaValueNow']) == newBlackRanges[i].end) {
                      // console.log(timeRangeArr[i].hasVisited);
                      if (newBlackRanges[i].hasVisited == false) {
                        console.log("HEYYY!");
                        newBlackRanges[i].hasVisited = true;
                        var audio = new Audio(
                          'https://media.geeksforgeeks.org/wp-content/uploads/20190531135120/beep.mp3');
                        audio.play();
                        console.log('PLAYED!!!');
                        const youtubeVideo = <HTMLVideoElement>document.getElementsByTagName("Video")[0];
                        youtubeVideo.pause();
                        // User uses k to resume the video
                        // TO DO #1: User uses tab to go over the comments

                        var commentsToRead = []

                        for (let j in commentsWithTimestamps) {
                          const timestamp_second = convertToSecond(commentsWithTimestamps[j].timestamps[0]);
                          if (timestamp_second >= newBlackRanges[i].start && timestamp_second <= newBlackRanges[i].end) {
                            commentsToRead.push(commentsWithTimestamps[j])
                          }
                        }

                        // commentToRead : # of keywords
                        // var dict: any = {};

                        // for (let x in commentsToRead) {
                        //   var numOfKeywords = 0;
                        //   // for (let y in text_on_screen_keywords) {
                        //   //   if (commentsToRead[x].text.includes(text_on_screen_keywords[y])) {
                        //   //     numOfKeywords += 1;
                        //   //   }
                        //   // }
                        //   dict[commentsToRead[x]] = numOfKeywords;
                        // }

                        // var sorted_dict: any = sort_object(dict);

                        // var sorted_commentsToRead = sorted_dict.keys;

                        console.log("COMMENTS TO READ")
                        // console.log(sorted_commentsToRead)

                        var comment_index = 0

                        document.onkeydown = function(evt) {
                          // evt = evt || window.event;
                          if (evt.shiftKey) {
                              // alert("Ctrl-Z");
                              if (comment_index == commentsToRead.length) {
                                var msg1 = new SpeechSynthesisUtterance();
                                msg1.text = "Those are all the comments!";
                                window.speechSynthesis.speak(msg1);
                                return;
                              }
                              if (comment_index > commentsToRead.length) {
                                return;
                              }
                              var msg2 = new SpeechSynthesisUtterance();
                              console.log("TO READ");
                              console.log(commentsToRead[comment_index].text);
                              msg2.text = commentsToRead[comment_index].text;
                              window.speechSynthesis.speak(msg2);
                              comment_index += 1

                          }
                        };
                      }
                    }
                    showFloatCard = true;
                    // if (document.getElementById("float-card") != null) {
                    //   if (timeRangeArr[i].type == timeRangeType.NonDialouge) {
                    //     document.getElementById("source-text").innerHTML = "Reason for showing: this video segment has no dialouge";
                    //   }
                    //   else if (timeRangeArr[i].type == timeRangeType.NoText) {
                    //     document.getElementById("source-text").innerHTML = "Reason for showing: text on screen not mentioned";
                    //   }
                    // }
                    // videoContainer.childElementCount == 1
                    if (document.getElementById("float-card") == null) {
                      videoContainer.appendChild(floatCard);   
                      const goButton = document.getElementById("go-button");
                      goButton.onclick = function(e) {
                        window.scrollTo(0, 1150);
                      }
                      // if (timeRangeArr[i].type == timeRangeType.NonDialouge) {
                      //   document.getElementById("source-text").innerHTML = "Reason for showing: this video segment has no dialouge";
                      // }
                      // else if (timeRangeArr[i].type == timeRangeType.NoText) {
                      //   document.getElementById("source-text").innerHTML = "Reason for showing: text on screen not mentioned";
                      // }
                    }
                    break;
                }
              }

              if (!showFloatCard && document.getElementById("float-card") != null) {
                videoContainer.removeChild(floatCard);
                document.onkeydown = undefined;
              }
              
              break;
          }
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
        }
    }
};

// Create an observer instance linked to the callback function
const new_observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
new_observer.observe(progressBar, { attributeFilter: [ "aria-valuenow" ], attributeOldValue: true, childList: true, subtree: true} );

// end

function convertToSecond(timestamp_string) {
  const min_second_arr = timestamp_string.split(":");
  return parseInt(min_second_arr[0]) * 60 + parseInt(min_second_arr[1]);   
}

function convertToMinSecond(timestamp_string) {
  console.log(timestamp_string);
  var timestamp_float = parseFloat(timestamp_string);
  var minutes = Math.floor(timestamp_float / 60);
  var seconds = Math.round(timestamp_float - minutes * 60);
  return String(minutes) + ":" + String(seconds);   
}

var comments;
var box;

let observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {

      if (!mutation.addedNodes) return;
  
      for (let i = 0; i < mutation.addedNodes.length; i++) {
        // do things to your newly added nodes here
        let node = mutation.addedNodes[i];

        if (node['className'] === 'ytp-progress-list') {
          console.log('Progress Bar');
          console.log(node); 
        }        

        if (node['id'] === 'placeholder-area') {
            console.log(node);
            const placeholder = node.childNodes[1];
            placeholder['onfocus'] = function(e) { 
              if (comments.childNodes[1].childElementCount === 1) {
                console.log("clicked!");
                box = document.createElement("DIV"); 
                box.setAttribute('style', 'background-color: rgb(229, 229, 229); width: 35%; height: 80%; padding: 1.5%; margin-top: -2%; margin-bottom: 2%; border-radius: 5%;');
                box.id = 'my-cool-node';             
                box.innerHTML = `<div style="font-size: 130%;">Easy Start</div>
                <div style="margin: 3%;">
                    <span>__looks like__&nbsp;&nbsp;</span>
                    <span>The color of __ is __</span>
                    <br>
                    <span>The __ is __</span>
                </div>
              <div style="font-size: 130%">See what others are talking about ...</div>
                <div style="margin-top: 3%;margin-left: 3%;margin-right: 3%;" id="othersComments">
                </div>`; 
              
                comments.childNodes[1].appendChild(box);

                const othersComments = document.getElementById("othersComments");
                for (let i in commentsToDisplay) {
                  var singleComment = document.createElement("DIV");
                  var singleTimestamp = document.createElement("SPAN");
                  singleTimestamp.setAttribute('style', 'color: blue;text-decoration: underline;');
                  singleTimestamp.innerHTML = commentsToDisplay[i].timestamps[0];

                  singleTimestamp.onclick = function(e) {
                    const youtubeVideo = <HTMLVideoElement>document.getElementsByTagName("Video")[0];
                    window.scrollTo(0, 0);
                    // Special situation: what if there is multiple timestamps
                    console.log("ATTENSION!!");
                    console.log(convertToSecond(commentsToDisplay[i].timestamps[0]));
                    youtubeVideo.currentTime = convertToSecond(commentsToDisplay[i].timestamps[0]);
                    youtubeVideo.play();
                  }
                  singleComment.appendChild(singleTimestamp);
                  singleTimestamp.insertAdjacentHTML('afterend', '&nbsp;&nbsp;' + commentsToDisplay[i].text);

                  othersComments.appendChild(singleComment);
                }
              }
            }
        }

        if (node['id'] === 'contenteditable-root') {
            var comment = document.getElementById('contenteditable-root');

            console.log(node);
            node['ariaLabel'] = 'What images are the most significant to the understanding and appreciation of the video?';
            // node.classList.push()
            comment.onkeypress = function(e) {
              console.log('key pressed!');
              console.log(comment.textContent);

              // Many edge cases here
              // Just consider one keyword case for now
              // Assume the comment only contains one keyword
              // Match transcript keywords with the comment the user is writing
              for (let i in ccKeywords) {
                if (comment.textContent.includes(ccKeywords[i]["text"])) {
                  box.innerHTML = `<div style="font-size: 130%">Add a time stamp ...</div>
                <div style="margin-top: 3%;margin-left: 3%;margin-right: 3%;">
                    <div style="margin-bottom: 2%;">suggested: Are you talking about&nbsp;&nbsp;<div id="timestamps"></div>?</div>
                </div>`;
                  // var timestamp_string = "";
                  for (let j in ccKeywords[i]["timestamps"]) {
                    // timestamp_string += (keywords[i]["timestamps"][j] + ", ");
                    var timestamp = document.createElement("SPAN");
                    timestamp.setAttribute("style", "color: blue;");
                    // timestamp.id = keywords[i]["timestamps"][j];
                    timestamp.innerHTML = convertToMinSecond(ccKeywords[i]["timestamps"][j]) + " ";
                    timestamp.onclick = function(e) {
                      // if (comment.textContent.substring(0, 5) !== "7:27 ") {
                      //   comment.textContent = "7:27 " + comment.textContent;
                      // }
                      comment.textContent = convertToMinSecond(ccKeywords[i]["timestamps"][j]) + " " + comment.textContent;
                      const youtubeVideo = <HTMLVideoElement>document.getElementsByTagName("Video")[0];
                      window.scrollTo(0, 0);
                      youtubeVideo.currentTime = parseFloat(ccKeywords[i]["timestamps"][j]);
                      youtubeVideo.play();
                    }
                    document.getElementById("timestamps").appendChild(timestamp);
                  }
                }
              }

              var matched_comments = [];
              for (let i in commentsWithTimestamps) {
                for (let j in commentsWithTimestamps[i].keywords) {
                  if (comment.textContent.includes(commentsWithTimestamps[i].keywords[j])) {
                    matched_comments.push(commentsWithTimestamps[i]);
                  }
                }
              }

              console.log(matched_comments);
              if (matched_comments.length != 0) {
                box.innerHTML = `<div style="font-size: 130%">Add a time stamp ...</div>
                <div style="margin-top: 3%;margin-left: 3%;margin-right: 3%;">
                    <div style="margin-bottom: 2%;">suggested: Are you talking about&nbsp;&nbsp;<div id="timestamps"></div>?</div>
                    <div id="sources"></div>
                </div>`;

                for (let i in matched_comments) {
                  var timestamp = document.createElement("SPAN");
                  timestamp.setAttribute("style", "color: blue;");
                  timestamp.innerHTML = matched_comments[i].timestamps[0] + " ";
                  timestamp.onclick = function(e) {
                    comment.textContent = matched_comments[i].timestamps[0] + " " + comment.textContent;
                    const youtubeVideo = <HTMLVideoElement>document.getElementsByTagName("Video")[0];
                    window.scrollTo(0, 0);
                    youtubeVideo.currentTime = convertToSecond(matched_comments[i].timestamps[0]);
                    youtubeVideo.play();
                  }
                  document.getElementById("timestamps").appendChild(timestamp);

                  var sourceComment = document.createElement("DIV");
                  sourceComment.innerHTML = matched_comments[i].text;
                  document.getElementById("sources").appendChild(sourceComment);
                }
              }

              if (comment.textContent === "Why is the bipolar neuron upset") {
                box.innerHTML = `<div style="font-size: 130%">Add a time stamp ...</div>
                <div style="margin-top: 3%;margin-left: 3%;margin-right: 3%;">
                    <div style="margin-bottom: 2%;">suggested: Are you talking about&nbsp;&nbsp;<span id="timestamp_1" style="color: blue;text-decoration: underline;">7:27</span>?</div>
                </div>`;
              }
              if (comment.textContent === "The leg shake is") {
                box.innerHTML = `<div style="font-size: 130%">Add a time stamp ...</div>
                <div style="margin-top: 3%;margin-left: 3%;margin-right: 3%;">
                    <div style="margin-bottom: 2%;">suggested: Are you talking about&nbsp;&nbsp;<span id="timestamp_2" style="color: blue;text-decoration: underline;">3:18</span>?</div>
                    <div><span style="color: blue;text-decoration: underline;">3:18</span>&nbsp;&nbsp;that little leg shake ...</div>
                </div>`;
              }
              if (comment.textContent === "You make it so easy to learn") {
                box.innerHTML = `<div style="font-size: 130%">Your clarification does help ...</div>
                <div style="margin-top: 3%;margin-left: 3%;margin-right: 3%;">
                    <div style="margin-bottom: 2%;">suggested: use concrete words</div>
                    <div style="color: grey;">what is "it" in this part of the comment?</div>
                </div>`;
              }

              const timestamp_1 = document.getElementById("timestamp_1");
              if (timestamp_1) {
                timestamp_1.onclick = function(e) {
                  if (comment.textContent.substring(0, 5) !== "7:27 ") {
                    comment.textContent = "7:27 " + comment.textContent;
                  }
                  const youtubeVideo = <HTMLVideoElement>document.getElementsByTagName("Video")[0];
                  window.scrollTo(0, 0);
                  youtubeVideo.currentTime = 447;
                  youtubeVideo.play();
                }
              }

              const timestamp_2 = document.getElementById("timestamp_2");
              if (timestamp_2) {
                timestamp_2.onclick = function(e) {
                  if (comment.textContent.substring(0, 5) !== "3:18 ") {
                    comment.textContent = "3:18 " + comment.textContent;
                  }
                  const youtubeVideo = <HTMLVideoElement>document.getElementsByTagName("Video")[0];
                  window.scrollTo(0, 0);
                  youtubeVideo.currentTime = 198;
                  youtubeVideo.play();
                }
              }

              // if (!box.innerHTML) {
              //   box.innerHTML = `<div style="font-size: 130%">Add a time stamp ...</div>
              // <div style="margin-top: 3%;margin-left: 3%;margin-right: 3%;">
              //     <div style="margin-bottom: 2%;">suggested: Are you talking about&nbsp;&nbsp;<span style="color: blue;text-decoration: underline;">06:22</span>?</div>
              //     <div><span style="color: blue;text-decoration: underline;">06:22</span>&nbsp;&nbsp;that bottle looks like ...</div>
              // </div>`;
              // }
            }
        }

        // do we need id?
        if (node['id'] === 'sections' && node['className'] === 'style-scope ytd-comments') {
            comments = node;
            console.log(node);
        }

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
    }})
  })
  
  observer.observe(document.body, {
      childList: true
    , subtree: true
    , attributes: true 
    , characterData: false
  })


});