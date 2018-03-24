// import { PLAY_STATUS, LOOP_STATUS, SHUFFLE_STATUS } from './backplayer';
import Store from './playerstore';
import View from './playerview';

export default class Frontplayer {
  constructor() {
    this.view = new View(this);
    this.e = document.querySelector('#slider');
    this.titleNode = document.querySelector('#player .title');
    this.beginTimeNode = document.querySelector('#player .begin');
    this.endTimeNode = document.querySelector('#player .end');
  }

  current() {
    Store.dispatch({
      from: 'player',
      op: 'current'
    });
  }

  status() {
    Store.dispatch({
      from: 'player',
      op: 'status'
    });
  }

  title(title) {
    Store.dispatch({
      from: 'player',
      op: 'title',
      title: title
    });
  }

  src(src, onload) {
    Store.dispatch({
      from: 'player',
      op: 'src',
      src: src,
      onload: onload
    });
  }

  autoplay(src) {
    this.src(src, () => {
      this.play();
    });
  }

  seek(time) {
    Store.dispatch({
      from: 'player',
      op: 'seek',
      time: time
    });
  }

  play() {
    Store.dispatch({
      from: 'player',
      op: 'play'
    });
  }

  pause() {
    Store.dispatch({
      from: 'player',
      op: 'pause'
    });
  }

  replay() {
    Store.dispatch({
      from: 'player',
      op: 'replay'
    });
  }

  next() {
    Store.dispatch({
      from: 'player',
      op: 'next'
    });
  }

  volumeup(amount) {
    Store.dispatch({
      from: 'player',
      op: 'volumeup',
      amount: amount
    });
  }

  volumedown(amount) {
    Store.dispatch({
      from: 'player',
      op: 'volumedown',
      amount: amount
    });
  }
}
