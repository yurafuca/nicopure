import { Store as PlayerStore } from './playerstore';
import { Store as QueueStore } from './queuestore';
import PlayerView from './playerview';
import { PLAY_STATUS } from './playerstate';

export default class FrontPlayer {
  static state() {
    PlayerStore.dispatch(
      {
        op: 'state'
      },
      state => {
        PlayerView.renderState(state);
      }
    );
  }

  static src(src, video) {
    PlayerStore.dispatch(
      {
        op: 'src',
        src: src,
        item: video
      },
      state => {
        chrome.browserAction.setBadgeText({ text: '＊' });
        PlayerView.renderState(state);
      }
    );
  }

  static seek(time) {
    PlayerStore.dispatch(
      {
        op: 'seek',
        time: time
      },
      state => {
        PlayerView.renderState(state);
      }
    );
  }

  static play() {
    PlayerStore.dispatch(
      {
        op: 'play'
      },
      state => {
        chrome.browserAction.setBadgeText({ text: '＊' });
        PlayerView.renderState(state);
      }
    );
  }

  static pause() {
    PlayerStore.dispatch(
      {
        op: 'pause'
      },
      state => {
        chrome.browserAction.setBadgeText({ text: '' });
        PlayerView.renderState(state);
      }
    );
  }

  static replay() {
    PlayerStore.dispatch(
      {
        op: 'replay'
      },
      state => {
        chrome.browserAction.setBadgeText({ text: '＊' });
        PlayerView.renderState(state);
      }
    );
  }

  static next() {
    PlayerStore.dispatch(
      {
        op: 'next'
      },
      state => {
        chrome.browserAction.setBadgeText({ text: '＊' });
        PlayerView.renderState(state);
      }
    );
  }

  static prev() {
    PlayerStore.dispatch(
      {
        op: 'prev'
      },
      state => {
        chrome.browserAction.setBadgeText({ text: '＊' });
        PlayerView.renderState(state);
      }
    );
  }

  // TODO
  static moveto(nextCurrentId) {
    QueueStore.dispatch(
      {
        op: 'moveto',
        nextCurrentId: nextCurrentId
      },
      () => {
        PlayerStore.dispatch({ op: 'state' }, state => {
          chrome.browserAction.setBadgeText({ text: '＊' });
          PlayerView.renderState(state);
        });
      }
    );
  }

  static togglePlay() {
    PlayerStore.dispatch(
      {
        op: 'toggle',
        from: 'viewer',
        target: 'play'
      },
      state => {
        PlayerView.renderState(state);
        if (state.mode.play === PLAY_STATUS.PLAY) {
          chrome.browserAction.setBadgeText({ text: '＊' });
        } else {
          chrome.browserAction.setBadgeText({ text: '' });
        }
      }
    );
  }

  static toggleLoop() {
    PlayerStore.dispatch(
      {
        op: 'toggle',
        from: 'viewer',
        target: 'loop'
      },
      state => {
        PlayerView.renderState(state);
      }
    );
  }

  static toggleShuffle() {
    PlayerStore.dispatch(
      {
        op: 'toggle',
        from: 'viewer',
        target: 'shuffle'
      },
      state => {
        PlayerView.renderState(state);
      }
    );
  }
}
