//const videoContainer = document.getElementsByClassName('html5-video-container')[0];

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
      margin-top: 2%
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

export {
  createFloatCard,
  deleteFloatCard,
  readComments,
}