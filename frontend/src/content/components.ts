//const videoContainer = document.getElementsByClassName('html5-video-container')[0];
import { convertToSecond } from "./utils";

function createFloatCard ({ start, end }) {
  const videoContainer = document.getElementsByClassName('html5-video-container')[0];
  const FLOATCARD_TITLE = 'Write a quick comment on what you see to help people!';
  const FLOATCARD_SEG = `From ${start} to ${end}`;
  const FLOATCARD_BUTTON = 'Go';
  const styles = `
    .float-card {
      position: absolute; 
      z-index: 2; 
      height: 10em; 
      width: 15%; 
      margin-top: 45%; 
      margin-left: 3%; 
      padding-right: 1%; 
      padding-left: 1%; 
      background-color: #E5E5E5; 
      border-radius: 0.5em;
    }
    .float-card>.text {
      color: #000000; 
      margin-left: 8%; 
      margin-top: 10%;
    }
    .float-card>.button {
      font-size: 12px; 
      margin-left: 78%; 
      margin-top: 2%;
    }
  `

  const title = document.createElement('p');
  title.classList.add('text');
  title.appendChild(document.createTextNode(FLOATCARD_TITLE));

  const seg = document.createElement('p');
  seg.classList.add('text')
  seg.appendChild(document.createTextNode(FLOATCARD_SEG));

  const jump = document.createElement('button');
  jump.classList.add('button')
  jump.appendChild(document.createTextNode(FLOATCARD_BUTTON));
  jump.onclick = () => {
    window.scrollTo(0, 1150);
  };

  const floatCard = document.createElement('div');
  floatCard.classList.add('float-card');
  floatCard.append(title, seg, jump);
  videoContainer.appendChild(floatCard);

  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

function deleteFloatCard () {
  console.log('delete')
  const videoContainer = document.getElementsByClassName('html5-video-container')[0];
  const floatCard = videoContainer.querySelector('.float-card');
  videoContainer.removeChild(floatCard);
}

function readComments(commentsTimed, { start, end }) {
  let commentsToRead = commentsTimed.filter(({timestamps}) => {
    Boolean(timestamps.find((timestamp) => start <= timestamp && timestamp < end));
  })

  // play the beep sound
  let audio = new Audio(
    'https://media.geeksforgeeks.org/wp-content/uploads/20190531135120/beep.mp3'
  )
  audio.play()
  console.log('PLAYED!!!')
  const youtubeVideo = <HTMLVideoElement>(
    document.getElementsByTagName('Video')[0]
  )
  youtubeVideo.pause()

  // read comments one by one
  let comment_index = 0

  document.addEventListener('keydown', handleKeyDown)

  function handleKeyDown (event) {
    // evt = evt || window.event;
    if (event.shiftKey) {
      // alert("Ctrl-Z");
      if (comment_index == commentsToRead.length) {
        const msg1 = new SpeechSynthesisUtterance()
        msg1.text = 'Those are all the comments!'
        window.speechSynthesis.speak(msg1)
        document.removeEventListener('keydown', handleKeyDown)
        return
      }
      const msg2 = new SpeechSynthesisUtterance()
      console.log('TO READ')
      console.log(commentsToRead[comment_index].text)
      msg2.text = commentsToRead[comment_index].text
      window.speechSynthesis.speak(msg2)
      comment_index += 1
    }
  }
}

function createEasyStartCard(commentsToDisplay) {
  // const videoContainer = document.getElementsByClassName('html5-video-container')[0];
  const EASYSTARTCARD_TITLE = 'Easy Start';
  const EASYSTARTTEXTS = ['__looks like__&nbsp;&nbsp;&nbsp;', 'The color of __ is __&nbsp;&nbsp;&nbsp;', 'The __ is __'];

  const styles = `
    .easy-start-card {
      background-color: rgb(229, 229, 229); 
      width: 35%; height: 80%; padding: 1.5%; 
      margin-bottom: 2%; 
      border-radius: 5%;
    }
    .easy-start-card>.easy-start {
      margin: 3%;
    }
    .easy-start-card>.comments {
      margin-top: 3%;
      margin-left: 3%;
      margin-right: 3%;
    }
    .single-timestamp {
      color: blue;
      text-decoration: underline;
    }
  `

  const title1 = document.createElement('h2');
  title1.classList.add('title1');
  title1.appendChild(document.createTextNode(EASYSTARTCARD_TITLE));

  const easyStart = document.createElement('div');
  easyStart.classList.add('easy-start');

  for (const text of EASYSTARTTEXTS) {
    const spanElement = document.createElement('span');
    spanElement.innerHTML = text;
    easyStart.appendChild(spanElement);
  }

  const title2 = document.createElement('h2');
  title2.classList.add('title2');
  title2.append("See what others are talking about...");
  
  const comments = document.createElement('ul');
  comments.classList.add('comments');

  for (let i in commentsToDisplay) {
    const curComment = commentsToDisplay[i];
    const singleComment = document.createElement('li');
    // Add all timestamps 
    const numOfTimestamps = curComment.timestamps.length;
    for (let j = 0; j < numOfTimestamps; j++) {
      const curTimestamp = curComment.timestamps[j];
      const singleTimestamp = document.createElement('span');
      singleTimestamp.classList.add('single-timestamp');
      singleComment.appendChild(singleTimestamp);
      singleTimestamp.innerHTML = curTimestamp;

      if (j == curComment.timestamps.length - 1) {
        singleTimestamp.insertAdjacentHTML(
          'afterend',
          '&nbsp;&nbsp;' + curComment.text
        );
      } else {
        // if it is not the last time stamp, add a space after it 
        singleTimestamp.insertAdjacentHTML(
          'afterend',
          '&nbsp;'
        );
      }

      singleTimestamp.onclick = function (e) {
        const youtubeVideo = <HTMLVideoElement>(
          document.getElementsByTagName('Video')[0]
        );
        window.scrollTo(0, 0);
        console.log(convertToSecond(curTimestamp));
        youtubeVideo.currentTime = convertToSecond(curTimestamp);
        youtubeVideo.play();
      }
    }

    comments.appendChild(singleComment);
  }

  const addCommentSection = document.querySelector('ytd-comments-header-renderer.style-scope.ytd-item-section-renderer');
  const easyStartCard = document.createElement('div');
  easyStartCard.classList.add('easy-start-card');
  easyStartCard.append(title1, easyStart, title2, comments);
  addCommentSection.appendChild(easyStartCard);

  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

export {
  createFloatCard,
  deleteFloatCard,
  readComments,
  createEasyStartCard,
}