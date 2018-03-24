export default class PlayerObserver {
  constructor(backplayer) {
    this.player = backplayer;
    this.type = 'player';
  }

  listen() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      const { title, src, time, amount } = request;

      switch (request.op) {
        case 'current':
          sendResponse(this.player.current());
          break;
        case 'status':
          sendResponse(this.player.status());
          break;
        case 'src':
          this.player.src(src, () => {
            sendResponse(this.player.current());
          });
          break;
        case 'seek':
          this.player.seek(time);
          break;
        case 'play':
          this.player.play();
          sendResponse(this.player.current());
          break;
        case 'pause':
          this.player.pause();
          break;
        case 'replay':
          this.player.replay();
          break;
        case 'next':
          this.player.next();
          break;
        case 'volumeup':
          this.player.volumeup(amount);
          break;
        case 'volumedown':
          this.player.volumedown(amount);
          break;
      }

      return true;
    });
  }
}
