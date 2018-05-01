import store from 'store';
import { toState } from './playerstore';
import { next } from './shift';
import { LOOP_STATUS } from './playerstate';

const send = chrome.runtime.sendMessage;

export default class Backplayer {
  constructor() {
    this.v = document.createElement('video');
    this.v.autoplay = true;
    // this.v.loop = true;
    this.v.volume = store.get('player.state').volume;
  }

  self() {
    return {
      src: this.v.src,
      autoplay: this.v.autoplay,
      loop: this.v.loop,
      currentTime: this.v.currentTime,
      duration: this.v.duration
    };
  }

  src(src, callback) {
    this.v.src = src;
    this.v.onloadedmetadata = () => callback();
    this.v.onended = () => this.ended();
  }

  // https://stackoverflow.com/questions/10461669/seek-to-a-point-in-html5-video
  seek(time) {
    // this.pause();
    this.v.currentTime = time;
  }

  play() {
    this.v.play();
  }

  pause() {
    this.v.pause();
  }

  replay() {
    this.seek(0);
    this.v.play();
  }

  loopon() {
    this.v.loop = true;
  }

  loopoff() {
    this.v.loop = false;
  }

  volume(amount) {
    this.v.volume = amount;
  }

  ended() {
    this.v.pause();

    const playerState = store.get('player.state');
    const loopMode = playerState.mode.loop;

    switch (loopMode) {
      case LOOP_STATUS.ONE_LOOP: {
        this.replay();
        const state = toState({}, this.self());
        send({ op: 'render', state });
        break;
      }
      case LOOP_STATUS.ALL_LOOP:
        next(state => {
          this.src(state.action.src, () => {
            const _state = toState(state.action, this.self());
            send({ op: 'render', state: _state });
          });
        });
        break;
      case LOOP_STATUS.NO_LOOP:
        break;
    }
  }
}
