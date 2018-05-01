import store from 'store';
import Backplayer from './backplayer';
import PlayerObserver from './playerobserver';

chrome.runtime.onInstalled.addListener(function(details) {
  if (details.reason == 'install') {
    store.set('player.title', '');
    store.set('player.state', {
      video: {},
      time: {
        duration: 0,
        durationString: '0:00',
        currentTime: 0,
        currentTimeString: '0:00'
      },
      mode: {
        play: 'PAUSE',
        loop: 'ALL_LOOP',
        shuffle: 'NO_SHUFFLE'
      },
      volume: 0.5
    });
    store.set('queue', {
      currentId: -1,
      videos: [],
      shuffledVideos: []
    });
  }
});

const player = new Backplayer();
const observer = new PlayerObserver(player);

chrome.browserAction.setBadgeBackgroundColor({ color: '#00b39f' });
observer.listen();
