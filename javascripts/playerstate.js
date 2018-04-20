import store from 'store';

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

export const PLAY_STATUS_LIST = Object.keys(PLAY_STATUS);
export const LOOP_STATUS_LIST = Object.keys(LOOP_STATUS);
export const SHUFFLE_STATUS_LIST = Object.keys(SHUFFLE_STATUS);

export const getNextMode = _target => {
  const modeList = (target => {
    switch (target) {
      case 'play':
        return PLAY_STATUS_LIST;
      case 'loop':
        return LOOP_STATUS_LIST;
      case 'shuffle':
        return SHUFFLE_STATUS_LIST;
    }
  })(_target);

  const currentState = store.get('player.state');
  const currentMode = currentState.mode[_target];
  const currentModeId = modeList.indexOf(currentMode);
  const nextModeId = (currentModeId + 1) % modeList.length;
  const nextMode = modeList[nextModeId];
  return nextMode;
};
