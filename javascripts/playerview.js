import { PLAY_STATUS, LOOP_STATUS, SHUFFLE_STATUS } from './playerstate';
import FrontPlayer from './frontplayer';

let interval = null;

const controllerElement = document.querySelector('#controller');
const playButton = controllerElement.querySelector('.play');
const prevButton = controllerElement.querySelector('.prev');
const nextButton = controllerElement.querySelector('.next');
const loopButton = controllerElement.querySelector('.loop');
const shuffleButton = controllerElement.querySelector('.shuffle');

const sliderElement = document.querySelector('#slider');
const titleElement = document.querySelector('#player .title');
const beginTimeElement = document.querySelector('#player .begin');
const endTimeElement = document.querySelector('#player .end');

export default class PlayerView {
  static init() {
    FrontPlayer.state();
    PlayerView.setEvent();
  }

  static setEvent() {
    playButton.addEventListener('click', () => {
      FrontPlayer.togglePlay();
    });

    loopButton.addEventListener('click', () => {
      FrontPlayer.toggleLoop();
    });

    shuffleButton.addEventListener('click', () => {
      FrontPlayer.toggleShuffle();
    });

    nextButton.addEventListener('click', () => {
      FrontPlayer.next();
    });

    prevButton.addEventListener('click', () => {
      FrontPlayer.prev();
    });

    sliderElement.addEventListener('mouseup', () => {
      const time = sliderElement.value;
      FrontPlayer.seek(time);
    });
  }

  static listen() {
    chrome.runtime.onMessage.addListener(request => {
      const { op, state } = request;

      switch (op) {
        case 'render': {
          PlayerView.renderState(state);
          break;
        }
        default:
          break;
      }
    });
  }

  static renderState(state) {
    const { video, time, mode, action } = state;

    sliderElement.max = time.duration;
    sliderElement.min = 0;
    sliderElement.value = time.currentTime;
    beginTimeElement.textContent = time.currentTimeString;
    endTimeElement.textContent = time.durationString;
    titleElement.textContent = time.title;

    if (mode.play) PlayerView.setPlay(mode.play);
    if (mode.loop) PlayerView.setLoop(mode.loop);
    if (mode.shuffle) PlayerView.setShuffle(mode.shuffle);

    // バッジ管理
    const videos = [...document.querySelectorAll('#playlist .video')];
    videos.forEach(videoElement => {
      const id = videoElement.querySelector('.id').textContent;

      videoElement.classList.remove('playing');

      if (id === video.id) {
        // バッジ表示
        videoElement.classList.add('playing');

        // スクロール
        if (action.op === 'src') {
          videoElement.scrollIntoView(true);
          const playlist = document.querySelector('#playlist');
          const items = playlist.querySelector('.items');
          items.scrollTop = items.scrollTop + 1;
        }
      }
    });

    titleElement.textContent = video.title ? video.title : '◀ 動画を選択してください';
  }

  static startTick() {
    // すでに tick している場合は一度 clear する
    clearInterval(interval);

    // tick
    interval = setInterval(() => {
      const nextTime = parseInt(sliderElement.value) + 1;
      const nextTimeSeconds = Math.floor(nextTime % 60);
      const nextTimeMinutes = Math.floor((nextTime / 60) % 60);
      const nextTimeString = nextTimeMinutes + ':' + ('0' + nextTimeSeconds).slice(-2);
      beginTimeElement.textContent = nextTimeString;
      sliderElement.value = nextTime;
    }, 1000);
  }

  static pauseTick() {
    clearInterval(interval);
  }

  static setPlay(status) {
    playButton.className = 'play';
    switch (status) {
      case PLAY_STATUS.PLAY:
        playButton.classList.add('is-play');
        PlayerView.startTick();
        break;
      case PLAY_STATUS.PAUSE:
        playButton.classList.add('is-pause');
        PlayerView.pauseTick();
        break;
    }
  }

  static setLoop(status) {
    loopButton.className = 'loop';
    switch (status) {
      case LOOP_STATUS.ONE_LOOP:
        loopButton.classList.add('one-loop');
        break;
      case LOOP_STATUS.ALL_LOOP:
        loopButton.classList.add('all-loop');
        break;
      case LOOP_STATUS.NO_LOOP:
        loopButton.classList.add('no-loop');
        break;
    }
  }

  static setShuffle(status) {
    shuffleButton.className = 'shuffle';
    switch (status) {
      case SHUFFLE_STATUS.SHUFFLE:
        shuffleButton.classList.add('is-shuffle');
        break;
      case SHUFFLE_STATUS.NO_SHUFFLE:
        shuffleButton.classList.add('no-shuffle');
        break;
    }
  }
}
