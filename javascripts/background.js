import store from 'store';
import Api from './api';
import axios from 'axios';
import Backplayer from './backplayer';
import PlayerObserver from './playerobserver';

const api = new Api();
const id = 'sm10179610';
const player = new Backplayer();
const observer = new PlayerObserver(player);

observer.listen();

// chrome.runtime.onInstalled.addListener(function(details) {
//   if (details.reason == 'update') {
// store.set('last.mylist', null);
// store.set('last.video', null);
// store.set('last.volume', null);
// store.set('last.query', null);
// store.set('last.candidates', null);
// store.set('last.playlist', null);
// store.set('playlists', {});
// store.set('playlists.noname', {});

store.set('player.current', {});
store.set('player.title', '');
store.set('player.state', {
  play: 'PAUSE',
  loop: 'ONE_LOOP',
  shuffle: 'NO_SHUFFLE'
});
// store.set('player.state', "PAUSE");
// }
// });
