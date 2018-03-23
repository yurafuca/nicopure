import { PLAY_STATUS, LOOP_STATUS, SHUFFLE_STATUS } from './backplayer';

export default class View {
  constructor(player) {
    this.player = player;
    this.slider = document.querySelector('#slider');
    this.beginTimeNode = document.querySelector('#player .begin');
    this.endTimeNode = document.querySelector('#player .end');
    this.element = document.querySelector('#controller');
    this.playButton = this.element.querySelector('.play');
    this.prevButton = this.element.querySelector('.prev');
    this.nextButton = this.element.querySelector('.next');
    this.loopButton = this.element.querySelector('.loop');
    this.shuffleButton = this.element.querySelector('.shuffle');

    player.current(current => {
      this.slider.max = current.duration;
      this.slider.min = 0;
      this.slider.value = current.currentTime;
      this.beginTimeNode.textContent = current.currentTimeString;
      this.endTimeNode.textContent = current.durationString;
      this.player.title(current.title);
    });

    player.status(status => {
      this.setPlay(status.play);
      this.setLoop(status.loop);
      this.setShuffle(status.shuffle);
    });

    this.setEvent();
  }

  setEvent() {
    this.playButton.addEventListener('click', () => {
      this.player.status(status => {
        this.setPlay(status.play, { controllPlayer: true });
      });
    });

    this.loopButton.addEventListener('click', () => {
      this.player.status(status => {
        this.setLoop(status.loop, { controllPlayer: true });
      });
    });

    this.shuffleButton.addEventListener('click', () => {
      this.player.status(status => {
        this.setShuffle(status.shuffle, { controllPlayer: true });
      });
    });

    this.slider.addEventListener('mouseup', () => {
      const time = this.slider.value;
      this.player.seek(time);
    });
  }

  setPlay(status, option = {}) {
    this.playButton.className = 'play';
    switch (status) {
      case PLAY_STATUS.PLAY:
        this.playButton.classList.add('is-play');
        break;
      case PLAY_STATUS.PAUSE:
        this.playButton.classList.add('is-pause');
        break;
    }
  }

  setLoop(status, option = {}) {
    this.loopButton.className = 'loop';
    switch (status) {
      case LOOP_STATUS.ONE_LOOP:
        this.playButton.classList.add('one-loop');
        break;
      case LOOP_STATUS.ALL_LOOP:
        this.playButton.classList.add('all-loop');
        break;
      case LOOP_STATUS.NO_LOOP:
        this.playButton.classList.add('no-loop');
        break;
    }
  }

  setShuffle(status, option = {}) {
    this.shuffleButton.className = 'shuffle';
    switch (status) {
      case SHUFFLE_STATUS.SHUFFLE:
        this.playButton.classList.add('is-shuffle');
        break;
      case LOOP_STATUS.NO_SHUFFLE:
        this.playButton.classList.add('no-shuffle');
        break;
    }
  }
}
