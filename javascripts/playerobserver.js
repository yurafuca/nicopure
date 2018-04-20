import store from 'store';

export default class PlayerObserver {
  constructor(backplayer) {
    this.player = backplayer;
    this.type = 'player';
  }

  listen() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      const { src, time, amount } = request;

      switch (request.op) {
        case 'state':
          sendResponse(this.player.self());
          break;
        case 'src':
          this.player.src(src, () => {
            sendResponse(this.player.self());
          });
          break;
        case 'seek':
          this.player.seek(time);
          sendResponse(this.player.self());
          break;
        case 'play':
          this.player.play();
          sendResponse(this.player.self());
          break;
        case 'pause':
          this.player.pause();
          sendResponse(this.player.self());
          break;
        case 'replay':
          this.player.replay();
          sendResponse(this.player.self());
          break;
        case 'loopon':
          this.player.loopon();
          sendResponse(this.player.self());
          break;
        case 'loopoff':
          this.player.loopoff();
          sendResponse(this.player.self());
          break;
        case 'volume':
          this.player.volume(amount);
          this._saveVolume(amount);
          sendResponse(this.player.self());
          break;
      }

      return true;
    });
  }

  _saveVolume(amount) {
    const state = store.get('player.state');
    state.volume = amount;
    store.set('player.state', state);
  }
}
