import store from 'store';
import Api from './api';
import Toast from './toast';
import { Store as PlayStore } from './playerstore';
import { Store as QueueStore } from './queuestore';
import { SHUFFLE_STATUS } from './playerstate';

const api = new Api();

export const next = callback => {
  shift('next', callback);
};

export const prev = callback => {
  shift('prev', callback);
};

const shift = (op, callback) => {
  QueueStore.dispatch({ op: op }, queue => {
    const { currentId, videos, shuffledVideos } = queue;

    const state = store.get('player.state');
    const { mode } = state;

    let video = null;

    if (mode.shuffle === SHUFFLE_STATUS.SHUFFLE) {
      video = shuffledVideos[currentId];
    } else {
      video = videos[currentId];
    }

    if (video == null) {
      PlayStore.dispatch({ op: 'replay' }, callback);
    } else {
      _fetchVideo(video, callback);
    }
  });
};

const _onSuccessFetchVideo = (src, video, callback) => {
  PlayStore.dispatch(
    {
      op: 'src',
      src: src,
      item: video
    },
    callback
  );
};

const _onFailureFetchVideo = callback => {
  const toastText = 'この動画は swf 形式です．この動画をスキップします';
  const toast = new Toast(toastText);
  toast.show();

  setTimeout(() => {
    PlayStore.dispatch({ op: 'next' }, callback);
  }, 3000);
};

const _fetchVideo = (video, callback) => {
  api.video
    .fetch(video.id)
    .then(src => {
      _onSuccessFetchVideo(src, video, callback);
    })
    .catch(() => {
      _onFailureFetchVideo(callback);
    });
};
