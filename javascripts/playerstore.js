import store from 'store';
import { next, prev } from './shift';
import { getNextMode } from './playerstate';
import { Store as QueueStore } from './queuestore';

const send = chrome.runtime.sendMessage;

export class Store {
  static dispatch(action, callback = () => {}) {
    Reducer.reduce(action, callback);
  }
}

class Reducer {
  static reduce(action, callback = () => {}) {
    const { op, target, item } = action;

    switch (op) {
      case 'state': {
        send(action, metadata => {
          const state = toState(action, metadata);
          callback(state);
        });
        break;
      }
      case 'src': {
        send(action, metadata => {
          const state = toState(action, metadata, item);
          state.mode['play'] = 'PLAY';
          store.set('player.state', state);
          callback(state);
        });
        break;
      }
      case 'seek': {
        send(action, metadata => {
          const state = toState(action, metadata, item);
          store.set('player.state', state);
          callback(state);
        });
        break;
      }
      case 'replay': {
        send(action, metadata => {
          const state = toState(action, metadata);
          store.set('player.state', state);
          callback(state);
        });
        break;
      }
      case 'next': {
        next(callback);
        break;
      }
      case 'prev': {
        prev(callback);
        break;
      }
      case 'play': {
        send(action, metadata => {
          const state = toState(action, metadata);
          state.mode['play'] = 'PLAY';
          store.set('player.state', state);
          callback(state);
        });
        break;
      }
      case 'pause': {
        send(action, metadata => {
          const state = toState(action, metadata);
          state.mode['play'] = 'PAUSE';
          store.set('player.state', state);
          callback(state);
        });
        break;
      }
      case 'toggle': {
        if (target === 'play') {
          const mode = getNextMode('play');
          Store.dispatch({ op: mode.toLocaleLowerCase() }, state => {
            callback(state);
          });
        } else if (target === 'loop') {
          send({ op: 'state' }, metadata => {
            const state = toState(action, metadata);
            const mode = getNextMode('loop');
            state.mode['loop'] = mode;
            store.set('player.state', state);
            callback(state);
          });
        } else if (target === 'shuffle') {
          send({ op: 'state' }, metadata => {
            const state = toState(action, metadata);
            const mode = getNextMode('shuffle');
            state.mode['shuffle'] = mode;
            store.set('player.state', state);
            QueueStore.dispatch({ op: 'shuffle' }); // shuffle queue.
            callback(state);
          });
        }
        break;
      }
    }

    return true; // for async
  }
}

export const toState = (action = {}, metadata = {}, item, mode) => {
  const duration = metadata.duration || 0;
  const durationSeconds = Math.floor(duration % 60);
  const durationMinutes = Math.floor((duration / 60) % 60);
  const durationString = durationMinutes + ':' + ('0' + durationSeconds).slice(-2);

  const currentTime = metadata.currentTime;
  const currentTimeSeconds = Math.floor(currentTime % 60);
  const currentTimeMinutes = Math.floor((currentTime / 60) % 60);
  const currentTimeString = currentTimeMinutes + ':' + ('0' + currentTimeSeconds).slice(-2);

  const currentState = store.get('player.state');
  const newState = {
    video: item || currentState.video,
    time: {
      duration: duration,
      durationString: durationString,
      currentTime: currentTime,
      currentTimeString: currentTimeString
    },
    mode: mode || currentState.mode,
    queue: store.get('queue'),
    volume: currentState.volume,
    action
  };

  return newState;
};
