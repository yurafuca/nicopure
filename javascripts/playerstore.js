import store from 'store';

let _player = null;
let _viewer = null;

export const PLAY_STATUS = {
  PLAY: 'PLAY',
  PAUSE: 'PAUSE'
};

export const LOOP_STATUS = {
  ONE_LOOP: 'ONE_LOOP',
  ALL_LOOP: 'ALL_LOOP',
  NO_LOOP: 'NO_LOOP'
};

export const SHUFFLE_STATUS = {
  SHUFFLE: 'SHUFFLE',
  NO_SHUFFLE: 'NO_SHUFFLE'
};

const PLAY_STATUS_LIST = Object.keys(PLAY_STATUS);
const LOOP_STATUS_LIST = Object.keys(LOOP_STATUS);
const SHUFFLE_STATUS_LIST = Object.keys(SHUFFLE_STATUS);

const send = chrome.runtime.sendMessage;

export default class Store {
  static dispatch(action, callback = () => {}) {
    // console.dir(action, callback);
    Reducer.reduce(action, callback);
  }

  static setPlayer(player) {
    _player = player;
  }

  static setViewer(viewer) {
    _viewer = viewer;
  }
}

class Reducer {
  static reduce(action, callback = () => {}) {
    const { sender, type, op, target, title, src, time, amount, onload } = action;

    if (type !== this.type) {
      return { error: 'Wrong type' };
    }

    switch (op) {
      case 'current': {
        send(action, current => {
          current.title = store.get('player.title');
          callback(current);
        });
        break;
      }
      case 'state': {
        callback(store.get('player.state'));
        break;
      }
      case 'title': {
        store.set('player.title', title);
        break;
      }
      case 'src': {
        send(action, current => {
          store.set('player.current', current);
          onload(current);
        });
        break;
      }
      case 'seek': {
        send(action);
        break;
      }
      case 'play': {
        send(action, current => {
          store.set('player.current', current);
          callback(current);
        });
        break;
      }
      case 'pause': {
        send(action);
        break;
      }
      case 'replay': {
        send(action);
        break;
      }
      case 'next': {
        send(action);
        break;
      }
      case 'volumeup': {
        send(action);
        break;
      }
      case 'volumedown': {
        send(action);
        break;
      }
      case 'toggle': {
        switch (target) {
          case 'play': {
            const state1 = _nextPlayState();
            switch (state1) {
              case PLAY_STATUS.PLAY:
                send({ op: 'play' });
                break;
              case PLAY_STATUS.PAUSE:
                send({ op: 'pause' });
                break;
            }
            _setPlayState(state1);
            callback(store.get('player.state'));
            break;
          }
          case 'loop': {
            const state2 = _nextLoopState();
            switch (state2) {
              case LOOP_STATUS.ONE_LOOP:
                send({ op: 'play' });
                break;
              case LOOP_STATUS.ALL_LOOP:
                send({ op: 'pause' });
                break;
              case LOOP_STATUS.NO_LOOP:
                send({ op: 'pause' });
                break;
            }
            _setLoopState(state2);
            callback(store.get('player.state'));
            break;
          }
          case 'shuffle': {
            const state = _nextShuffleState();
            if (state === PLAY_STATUS.PLAY) {
              send({ op: 'play' });
            } else {
              send({ op: 'pause' });
            }
            _setShuffleState(state);
            callback(store.get('player.state'));
            break;
          }
        }
        break;
      }
    }

    return true; // for async
  }
}

const _nextPlayState = () => {
  const stateList = store.get('player.state');
  const state = stateList.play;
  const stateId = PLAY_STATUS_LIST.indexOf(state);
  const nextStateId = stateId + 1;
  const nextState = PLAY_STATUS_LIST[nextStateId % PLAY_STATUS_LIST.length];
  return nextState;
};

const _nextLoopState = () => {
  const stateList = store.get('player.state');
  const state = stateList.loop;
  const stateId = LOOP_STATUS_LIST.indexOf(state);
  const nextStateId = stateId + 1;
  const nextState = LOOP_STATUS_LIST[nextStateId % LOOP_STATUS_LIST.length];
  return nextState;
};

const _nextShuffleState = () => {
  const stateList = store.get('player.state');
  const state = stateList.shuffle;
  const stateId = SHUFFLE_STATUS_LIST.indexOf(state);
  const nextStateId = stateId + 1;
  const nextState = SHUFFLE_STATUS_LIST[nextStateId % SHUFFLE_STATUS_LIST.length];
  return nextState;
};

const _setPlayState = state => {
  const stateList = store.get('player.state');
  stateList.play = state;
  store.set('player.state', stateList);
};

const _setLoopState = state => {
  const stateList = store.get('player.state');
  stateList.loop = state;
  store.set('player.state', stateList);
};

const _setShuffleState = state => {
  const stateList = store.get('player.state');
  stateList.shuffle = state;
  store.set('player.state', stateList);
};
