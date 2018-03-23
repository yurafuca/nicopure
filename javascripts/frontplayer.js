import { PLAY_STATUS, LOOP_STATUS, SHUFFLE_STATUS } from './backplayer';
import View from './playerview';
let interval = null;

export default class Frontplayer {
  constructor() {
    this.view = new View(this);
    this.e = document.querySelector('#slider');
    this.titleNode = document.querySelector('#player .title');
    this.beginTimeNode = document.querySelector('#player .begin');
    this.endTimeNode = document.querySelector('#player .end');
  }

  current(callback) {
    const options = {
      type: 'player',
      op: 'current'
    };
    chrome.runtime.sendMessage(options, res => {
      callback(res);
    });
  }

  status(callback) {
    const options = {
      type: 'player',
      op: 'status'
    };
    chrome.runtime.sendMessage(options, res => {
      callback(res);
    });
  }

  title(title) {
    const options = {
      type: 'player',
      op: 'title',
      title: title
    };
    chrome.runtime.sendMessage(options);
    this.titleNode.textContent = title;
  }

  src(src, callback) {
    const options = {
      type: 'player',
      op: 'src',
      src: src
    };
    chrome.runtime.sendMessage(options, res => {
      callback(res);
    });
  }

  autoplay(src) {
    this.src(src, current => {
      this.play();

      this.beginTimeNode.textContent = '0:00';
      this.endTimeNode.textContent = current.durationString;
      this.e.max = current.duration;
      this.titleNode.textContent = current.title;

      clearInterval(interval);
      interval = setInterval(() => {
        this.e.value = parseInt(this.e.value) + 1;
      }, 1000);
    });
  }

  seek(time) {
    const options = {
      type: 'player',
      op: 'seek',
      time: time
    };
    chrome.runtime.sendMessage(options);
  }

  play() {
    const options = {
      type: 'player',
      op: 'play'
    };
    chrome.runtime.sendMessage(options, current => {});
  }

  pause() {
    const options = {
      type: 'player',
      op: 'pause'
    };
    chrome.runtime.sendMessage(options);
    this.view.setPlay(PLAY_STATUS.PAUSE);
  }

  replay() {
    const options = {
      type: 'player',
      op: 'replay'
    };
    chrome.runtime.sendMessage(options);
  }

  next() {
    const options = {
      type: 'player',
      op: 'next'
    };
    chrome.runtime.sendMessage(options);
  }

  volumeup(amount) {
    const options = {
      type: 'player',
      op: 'volumeup',
      amount: amount
    };
    chrome.runtime.sendMessage(options);
  }

  volumedown(amount) {
    const options = {
      type: 'player',
      op: 'volumedown',
      amount: amount
    };
    chrome.runtime.sendMessage(options);
  }
}
