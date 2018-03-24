import { PLAY_STATUS, LOOP_STATUS, SHUFFLE_STATUS } from './playerstore';
import Store from './playerstore';
let interval = null;

export default class View {
  constructor(player) {
    this.player = player;
    this.slider = document.querySelector('#slider');
    this.titleNode = document.querySelector('#player .title');
    this.beginTimeNode = document.querySelector('#player .begin');
    this.endTimeNode = document.querySelector('#player .end');
    this.element = document.querySelector('#controller');
    this.playButton = this.element.querySelector('.play');
    this.prevButton = this.element.querySelector('.prev');
    this.nextButton = this.element.querySelector('.next');
    this.loopButton = this.element.querySelector('.loop');
    this.shuffleButton = this.element.querySelector('.shuffle');

    Store.dispatch(
      {
        op: 'current',
        from: 'viewer'
      },
      current => {
        if (current == null) return;
        this.slider.max = current.duration;
        this.slider.min = 0;
        this.slider.value = current.currentTime;
        this.beginTimeNode.textContent = current.currentTimeString;
        this.endTimeNode.textContent = current.durationString;
        this.titleNode.textContent = current.title;

        clearInterval(interval);
        interval = setInterval(() => {
          const nextTime = parseInt(this.slider.value) + 1;
          const nextTimeSeconds = Math.floor(nextTime % 60);
          const nextTimeMinutes = Math.floor((nextTime / 60) % 60);
          const nextTimeString = nextTimeMinutes + ':' + ('0' + nextTimeSeconds).slice(-2);
          this.beginTimeNode.textContent = nextTimeString;
          this.slider.value = nextTime;
        }, 1000);
      }
    );

    Store.dispatch(
      {
        op: 'state',
        from: 'viewer'
      },
      state => {
        this.setPlay(state.play);
        this.setLoop(state.loop);
        this.setShuffle(state.shuffle);
      }
    );

    this.setEvent();
  }

  setEvent() {
    this.playButton.addEventListener('click', () => {
      Store.dispatch(
        {
          op: 'toggle',
          from: 'viewer',
          target: 'play'
        },
        state => {
          this.setPlay(state.play);
        }
      );
    });

    this.loopButton.addEventListener('click', () => {
      Store.dispatch(
        {
          op: 'toggle',
          from: 'viewer',
          target: 'loop'
        },
        state => {
          this.setLoop(state.loop);
        }
      );
    });

    this.shuffleButton.addEventListener('click', () => {
      Store.dispatch(
        {
          op: 'toggle',
          from: 'viewer',
          target: 'shuffle'
        },
        state => {
          this.setShuffle(state.shuffle);
        }
      );
    });

    this.slider.addEventListener('mouseup', () => {
      const time = this.slider.value;
      Store.dispatch({
        op: 'seek',
        from: 'viewer',
        time: time
      });
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
        this.loopButton.classList.add('one-loop');
        break;
      case LOOP_STATUS.ALL_LOOP:
        this.loopButton.classList.add('all-loop');
        break;
      case LOOP_STATUS.NO_LOOP:
        this.loopButton.classList.add('no-loop');
        break;
    }
  }

  setShuffle(status, option = {}) {
    this.shuffleButton.className = 'shuffle';
    switch (status) {
      case SHUFFLE_STATUS.SHUFFLE:
        this.shuffleButton.classList.add('is-shuffle');
        break;
      case SHUFFLE_STATUS.NO_SHUFFLE:
        this.shuffleButton.classList.add('no-shuffle');
        break;
    }
  }
}
