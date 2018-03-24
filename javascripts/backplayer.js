export default class Backplayer {
  constructor() {
    this.v = document.createElement('video');
    this.v.autoplay = true;
    this.v.loop = true;
    // this.v.volume = 0;
  }

  current() {
    const duration = this.v.duration || 0;
    const durationSeconds = Math.floor(duration % 60);
    const durationMinutes = Math.floor((duration / 60) % 60);
    const durationString = durationMinutes + ':' + ('0' + durationSeconds).slice(-2);

    const currentTime = this.v.currentTime;
    const currentTimeSeconds = Math.floor(currentTime % 60);
    const currentTimeMinutes = Math.floor((currentTime / 60) % 60);
    const currentTimeString = currentTimeMinutes + ':' + ('0' + currentTimeSeconds).slice(-2);

    return {
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

  loopon() {
    this.v.loop = true;
  }

  loopoff() {
    this.v.loop = false;
  }

  volumeup(amount) {
    this.v += amount;
  }

  volumedown(amount) {
    this.v -= amount;
  }
}
