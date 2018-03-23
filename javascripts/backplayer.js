export const PLAY_STATUS = {
  PLAY: 'PLAY',
  PAUSE: 'PAUSE'
};

export const LOOP_STATUS = {
  ONE_LOOP: 'LOOP_ONE',
  ALL_LOOP: 'LOOP_ALL',
  NO_LOOP: 'NO_LOOP'
};

export const SHUFFLE_STATUS = {
  SHUFFLE: 'SHUFFLE',
  NO_SHUFFLE: 'NO_SHUFFLE'
};

export default class Backplayer {
  constructor() {
    this._title = '';
    this._status = {
      play: PLAY_STATUS.PAUSE,
      loop: PLAY_STATUS.ONE_LOOP,
      SHUFFLE: PLAY_STATUS.NO_SHUFFLE
    };
    this.v = document.createElement('video');
    this.v.autoplay = true;
    this.v.loop = true;
    this.v.volume = 0;
  }

  current() {
    const duration = this.v.duration;
    const durationSeconds = Math.floor(duration % 60);
    const durationMinutes = Math.floor((duration / 60) % 60);
    const durationString = durationMinutes + ':' + ('0' + durationSeconds).slice(-2);

    const currentTime = this.v.currentTime;
    const currentTimeSeconds = Math.floor(currentTime % 60);
    const currentTimeMinutes = Math.floor((currentTime / 60) % 60);
    const currentTimeString = currentTimeMinutes + ':' + ('0' + currentTimeSeconds).slice(-2);

    return {
      title: this._title,
      duration: this.v.duration,
      durationString: durationString,
      currentTime: this.v.currentTime,
      currentTimeString: currentTimeString
    };
  }

  status() {
    return this._status;
  }

  src(src, callback) {
    this.v.src = src;
    this.v.onloadedmetadata = () => callback();
  }

  title(title) {
    this._title = title;
  }

  autoplay(src, callback) {
    this.src(src, () => {
      this.play();
      callback();
    });
  }

  // https://stackoverflow.com/questions/10461669/seek-to-a-point-in-html5-video
  seek(time) {
    this.pause();
    this.v.currentTime = time;
    this.play();
  }

  play() {
    this.v.play();
  }

  pause() {
    this.v.pause();
  }

  replay() {
    this.seek(0);
  }

  next() {}

  volumeup(amount) {
    this.v += amount;
  }

  volumedown(amount) {
    this.v -= amount;
  }
}
