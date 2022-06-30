import { feedBack, secondToStamp, stampToSecond, waitForPromise } from "./utils";
import * as Tone from 'tone'
import { commentVote } from "../background/api";
import Mark from 'mark.js';

function createFloatCard (start, end, reason, videoId, videoTitle) {
  const FLOATCARD_TITLE = 'Click this icon to write an accessible comment!';
  const FLOATCARD_TIME = `From ${secondToStamp(start)} to ${secondToStamp(end)}:`;

  const prevTip = document.querySelector<HTMLElement>('.float-tip')
  if (prevTip) {
    prevTip.style.display = 'block';
    return;
  }
  const video = document.getElementsByTagName('video')[0];
  const videoContainer = document.querySelector('.html5-video-player');
  
  const styles = `
    .float-tip {
      z-index: 1000;
      position: absolute; 
      height: 0;
      width: 3%; 
      padding-bottom: 3%;
      top: 50%;
      left: 2%;
    }

    .float-tip img {
      z-index: 1000;
      position: absolute;
      height: 100%; 
      width: 100%;
      border-radius: 50%;
    }

    .float-card {
      position: absolute; 
      z-index: 1000; 
      height: auto; 
      width: 17%; 
      top: 55%; 
      left: 3%; 
      padding: 1.5%;
      background-color: #EEEEEE; 
      border-radius: 0.5em;
    }

    .float-card>.text {
      color: #000000;
      margin-top: 4%;
    }
  `
  
  const img = document.createElement("img");
  Object.assign(img, {
    src: chrome.runtime.getURL('float.png'), alt: 'tip',  
    onclick: handleClick,
    onmouseover: handleHover,
    onmouseout: handleHover,
  });
  const tip = document.createElement('div');
  tip.classList.add('float-tip');
  tip.appendChild(img);

  function handleClick(event) {
    const zoom = videoContainer.querySelector<HTMLElement>('.ytp-fullscreen-button');
    if(zoom.getAttribute('title') === 'Exit full screen (f)') zoom.click();
    document.querySelector<HTMLElement>('#chevron').click();
    waitForPromise('#secondary #placeholder-area', document.body).then(holder => holder.click());
    waitForPromise('#secondary #contenteditable-root', document.body).then(edit => {
      edit.append(' ' + secondToStamp(video.currentTime))
      edit.focus();
    });
    feedBack(videoId, videoTitle, 'iconStamps', secondToStamp(video.currentTime))
    setTimeout(() => { 
      window.scroll(0, 0); 
    }, 1000);
  }

  function handleHover(event) {
    const card = document.querySelector<HTMLElement>('.float-card');
    if (card) {
      if (event.type == 'mouseover') {
        card.style.display = 'block';
      }
      if (event.type == 'mouseout') {
        card.style.display = 'none';
      }
    }
  }

  const title = document.createElement('p');
  title.classList.add('text');
  title.append(FLOATCARD_TITLE);

  const time = document.createElement('p');
  time.classList.add('time-text', 'text');
  time.append(FLOATCARD_TIME);

  // why we are showing this float card
  const cardReason = document.createElement('p');
  cardReason.classList.add('reason-text', 'text');
  cardReason.append(reason);

  const floatCard = document.createElement('div');
  floatCard.classList.add('float-card');
  floatCard.append(title, time, cardReason);
  floatCard.style.display = 'none';
  videoContainer.append(floatCard, tip);

  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

function readComments(videoId, commentsTimed, { start, end }) {
  let commentsToRead = commentsTimed.filter(({timestamps}) => 
    Boolean(timestamps.find(timestamp => (
      start <= stampToSecond(timestamp) && stampToSecond(timestamp) < end
    )))
  );

  const synth = new Tone.Synth().toDestination();
  //play a middle 'C' for the duration of an 8th note
  if (start != 0) synth.triggerAttackRelease("C4", "8n");
  
  document.removeEventListener("keydown", window.keyDownHandler);

  let commentIndex = -1;
  window.keyDownHandler = function handleKeyDown (event) {
    const msg = new SpeechSynthesisUtterance();
    if (event.key == 'Shift') {
      if (commentsToRead.length == 0) {
        msg.text = 'There is no comment in this segment';
        window.speechSynthesis.speak(msg);
        document.removeEventListener('keydown', window.keyDownHandler);
        return null
      }
      commentIndex += 1;
      if (commentIndex == commentsToRead.length) {
        msg.text = 'Those are all the comments!';
        window.speechSynthesis.speak(msg);
        document.removeEventListener('keydown', window.keyDownHandler);
        return null
      } else {
        msg.text = commentsToRead[commentIndex].text; 
      }
    }
    else if (event.key == '') {
      document.removeEventListener('keydown', window.keyDownHandler);
    }
    else if (event.key == 'ArrowUp' && commentsToRead[commentIndex]) {
      msg.text = 'Up voted!'
      commentVote(videoId, commentsToRead[commentIndex]._id, 1)
    }
    else if (event.key == 'ArrowDown' && commentsToRead[commentIndex]) {
      msg.text = 'Down voted!'
      commentVote(videoId, commentsToRead[commentIndex]._id, -1)
    }
    window.speechSynthesis.speak(msg);
  }

  document.addEventListener('keydown', window.keyDownHandler)
}

function createAddTimeCard(parent: HTMLElement) {
  const TIMECARD = 'Consider adding a timestamp to make your comment more accessible!'

  const prevTimeCard = parent.querySelector<HTMLElement>('.add-time-card')
  if (prevTimeCard) {
    prevTimeCard.style.display = 'inline-block';
    return;
  }

  const styles = `
    .add-time-card {
      background-color: rgb(229, 229, 229); 
      width: 40%; 
      padding: 3%; 
      margin: 2%; 
      border-radius: 0.5em;
      display: inline-block;
    }
  `
  const startCard = parent.querySelector('.easy-start-card');

  const addTimeCard = document.createElement('div');
  addTimeCard.classList.add('add-time-card');
  addTimeCard.append(TIMECARD);
  startCard.insertAdjacentElement('beforebegin', addTimeCard);

  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

function createClarifyCard(parent: HTMLElement) {
  const CLARIFYCARD = 'Try to avoid using ambiguous pronouns, use the full names or concepts instead.'

  const prevClarifyCard = parent.querySelector<HTMLElement>('.clarify-card')
  if (prevClarifyCard) {
    prevClarifyCard.style.display = 'inline-block';
    return;
  }

  const styles = `
    .clarify-card {
      background-color: rgb(229, 229, 229); 
      width: 40%; 
      padding: 3%; 
      margin: 2%; 
      border-radius: 0.5em;
      display: inline-block;
    }
  `
  const startCard = parent.querySelector('.easy-start-card');

  const clarifyCard = document.createElement('div');
  clarifyCard.classList.add('clarify-card');
  clarifyCard.append(CLARIFYCARD);
  startCard.insertAdjacentElement('beforebegin', clarifyCard);

  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

function createStartCard(parent: HTMLElement) {
  const STARTCARD_CAPTION = 'The video also talks about...'
  const STARTCARD_COMMENT = 'People also talk about...';

  const styles = `
    .easy-start-card {
      background-color: rgb(229, 229, 229); 
      width: 90%;  
      padding: 3%; 
      margin: 2%; 
      border-radius: 0.5em;
    }

    .easy-start-card .comTitle {
      margin-top: 3%;
    }
  `

  const prevStartCard = parent.querySelector<HTMLElement>('.easy-start-card')
  if (!prevStartCard) {
    const capTitle = document.createElement('h3');
    capTitle.classList.add('title', 'capTitle');
    capTitle.append(STARTCARD_CAPTION);

    const comTitle = document.createElement('h3');
    comTitle.classList.add('title', 'comTitle');
    comTitle.append(STARTCARD_COMMENT);

    const easyStartCard = document.createElement('div');
    easyStartCard.classList.add('easy-start-card');
    easyStartCard.append(capTitle, comTitle);
    parent.insertAdjacentElement('beforeend', easyStartCard);

    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
  } else {
    prevStartCard.style.display = 'block';
  }
}

function editStartCard(captions, comments, keywords, parent: HTMLElement) {
  const styles = `
    .easy-start-card ul {
      margin-top: 2%;
      margin-left: 5%;
      margin-right: 5%;
    }
    .easy-start-card .timestamp {
      color: blue;
      text-decoration: underline;
    }
    .easy-start-card span{
      cursor: pointer;
      margin-right: 2%
    }
  `

  const video = document.getElementsByTagName('video')[0];
  const capContainer = parent.querySelector('.capContainer')
  if (capContainer) capContainer.remove()
  const comContainer = parent.querySelector('.comContainer')
  if (comContainer) comContainer.remove()

  captions.sort((a, b) => (a.start - b.start))
  comments.sort((a, b) => (stampToSecond(a.timestamps[0]) - stampToSecond(b.timestamps[0])))

  const captionContainer = document.createElement('ul');
  captionContainer.classList.add('capContainer');

  if (captions.length == 0) {
    const captionElement = document.createElement('div');
    captionElement.append('No matches found.');
    captionContainer.appendChild(captionElement);
  } else {
    captions.forEach(caption => {
      const captionElement = document.createElement('li');
      const timestamp = secondToStamp(caption.start)
      const stampElement = document.createElement('span');
      stampElement.classList.add('timestamp');
      stampElement.append(timestamp);
      stampElement.onclick = () => {
        window.scrollTo(0, 0);
        video.currentTime = caption.start;
        video.play();
        waitForPromise('#secondary #contenteditable-root', document.body).then(edit => {
          edit.append(' ' + timestamp)
          edit.focus();
        });
      }
      captionElement.appendChild(stampElement);
      captionElement.append(caption.text);
      captionContainer.appendChild(captionElement);
    })
  }
  
  const commentContainer = document.createElement('ul');
  commentContainer.classList.add('comContainer');

  if (comments.length == 0) {
    const commentElement = document.createElement('div');
    commentElement.append('No matches found.');
    commentContainer.appendChild(commentElement);
  } else {
    comments.forEach(comment => {
      const commentElement = document.createElement('li');
      comment.timestamps.forEach(timestamp => {
        const stampElement = document.createElement('span');
        stampElement.classList.add('timestamp');
        stampElement.append(timestamp);
        stampElement.onclick = () => {
          window.scrollTo(0, 0);
          video.currentTime = stampToSecond(timestamp);
          video.play();
          waitForPromise('#secondary #contenteditable-root', document.body).then(edit => {
            edit.append(' ' + timestamp)
            edit.focus();
          });
        }
        commentElement.appendChild(stampElement);
      })
      commentElement.append(comment.text);
      commentContainer.appendChild(commentElement);
    })
  }

  const capTitle = parent.querySelector('.capTitle')
  capTitle.insertAdjacentElement('afterend', captionContainer);

  const comTitle = parent.querySelector('.comTitle')
  comTitle.insertAdjacentElement('afterend', commentContainer);

  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);

  let markInstance = new Mark(parent.querySelector('.easy-start-card'));
  markInstance.unmark({
    done: () => {
      markInstance.mark(keywords);
    }
  });
}

function createRangeBar(blackRanges, thresh) {
  // const palette = ['#e3f2fd', '#bbdefb', '#90caf9', '#64b5f6', '#42a5f5', '#2196f3', '#1e88e5', '#1976d2', '#1565c0', '#0d47a1'];
  const palette = ['#f9a825', '#ffeb3b', '#fffde7'];
  // ffea00
  const styles = `
    .range-bar {
      background-color: white;
      width: 100%;
      height: 5px;
      margin: auto;
      position: relative;
      z-index: 2;
    }
    .range-bar .seg {
      height: 100%;
      position: absolute;
    }

  `

  const barContainer = document.querySelector('.ytp-progress-bar-container');
  const bar = document.createElement('div');
  bar.classList.add('range-bar')
  const totalTime = blackRanges[blackRanges.length - 1].end;
  let left = 0, width = 0, color = '';

  let rangesCopy = JSON.parse(JSON.stringify(blackRanges));
  rangesCopy.sort((a, b) => a.score - b.score)
  const thresh1 = rangesCopy[5].score
  const thresh2 = thresh

  blackRanges.forEach((blackRange, i) => {
    const {start, end, score} = blackRange;
    width = (end - start) / totalTime * 100;
    color = score < thresh1 ? palette[0] :  
            score < thresh2 ? palette[1] : palette[2]

    const seg = document.createElement('div');
    seg.classList.add('seg');
    seg.setAttribute('id', 'seg' + i)
    bar.appendChild(seg);
    seg.style.width = width + '%';
    seg.style.left = left + '%';
    seg.style.backgroundColor = color;
    left += width;
  })
  barContainer.insertAdjacentElement('afterend', bar)

  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

function createAccordion(commentsTimed, parent) {
  const styles = `
    .accordion>.accordion-button {
      background-color: #eee;
      color: #444;
      cursor: pointer;
      padding: 18px;
      width: 100%;
      border: none;
      text-align: left;
      outline: none;
      font-size: 15px;
      transition: 0.4s;
    }

    .accordion>.active, .accordion>.accordion-button:hover {
      background-color: #ccc;
    }

    .accordion>.accordion-button:after {
      content: '\\002B';
      color: #777;
      font-weight: bold;
      float: right;
      margin-left: 5px;
    }

    .accordion>.active:after {
      content: '\\2212';
    }

    .accordion>.accordion-body {
      padding: 0px 30px 10px;
      background-color: white;
      display: none;
      overflow: hidden;
    }

    .accordion .time-header {
      margin-top: 15px;
      margin-bottom: 5px;
    }

    .accordion .accordion-comment {
      font-size: 14px;
      margin-bottom: 5px;
    }

  `

  const accordionButton = document.createElement('button');
  accordionButton.classList.add("accordion-button");
  accordionButton.append("Accessible Comments");

  const accordionBody = document.createElement('div');
  accordionBody.classList.add("accordion-body");

  // collect all the timestamps
  let allTimestamps = [];
  commentsTimed.forEach(comment => {
    comment.timestamps.forEach(timestamp => {
      if (!allTimestamps.includes(timestamp)) {
        allTimestamps.push(timestamp);
      }
    })
  })

  // sort these timestamps
  allTimestamps.sort((a, b) => (stampToSecond(a) - stampToSecond(b)));

  // create the structure
  allTimestamps.forEach(timestamp => {
    const timeHeader = document.createElement('h1');
    timeHeader.classList.add('time-header');
    timeHeader.append(timestamp);
    const commentList = document.createElement('ul');
    commentList.classList.add('comment-list');
    commentList.setAttribute('id', 'timestamp-' + timestamp);
    accordionBody.append(timeHeader, commentList);
  })

  const accordion = document.createElement('div');
  accordion.classList.add('accordion');
  accordion.append(accordionButton, accordionBody);

  parent.insertAdjacentElement('beforebegin', accordion);

  // add all the comments
  commentsTimed.forEach(comment => {
    comment.timestamps.forEach(timestamp => {
      const accordionComment = document.createElement('li');
      accordionComment.classList.add('accordion-comment');
      accordionComment.append(comment.text);
      const commentList = document.getElementById('timestamp-' + timestamp);
      commentList.append(accordionComment);
    })
  })

  // add interactions
  let acc = document.getElementsByClassName("accordion-button");
  for (let i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function() {
      /* Toggle between adding and removing the "active" class,
      to highlight the button that controls the panel */
      this.classList.toggle("active");

      /* Toggle between hiding and showing the active panel */
      var panel = this.nextElementSibling;
      if (panel.style.display === "block") {
        panel.style.display = "none";
      } else {
        panel.style.display = "block";
      }
    });
  }

  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

export {
  createFloatCard,
  readComments,
  createStartCard,
  editStartCard,
  createRangeBar,
  createAccordion,
  createAddTimeCard,
  createClarifyCard,
}