import store from 'store';

export class Store {
  static dispatch(action, callback) {
    Reducer.reduce(action, callback);
  }
}

class Reducer {
  static reduce(action, callback) {
    const { op, video, id, nextCurrentId } = action;
    const queue = store.get('queue');
    const { currentId, videos, shuffledVideos } = queue;

    switch (op) {
      case 'current': {
        if (callback) callback(queue);
        break;
      }
      case 'moveto': {
        queue.currentId = nextCurrentId;
        store.set('queue', queue);
        if (callback) callback(queue);
        break;
      }
      case 'next': {
        const nextId = (currentId + 1) % videos.length;
        queue.currentId = nextId >= 0 ? nextId : 0;
        store.set('queue', queue);
        if (callback) callback(queue);
        break;
      }
      case 'prev': {
        const prevId = currentId - 1;
        queue.currentId = prevId >= 0 ? prevId : videos.length - 1;
        store.set('queue', queue);
        if (callback) callback(queue);
        break;
      }
      case 'add': {
        const checkDuplicate = _video => {
          return _video.id === video.id;
        };
        const isDuplicate = videos.some(video => checkDuplicate(video));
        if (isDuplicate) {
          if (callback) callback({ error: 'duplicate' });
          break;
        }
        videos.push(video);
        const clone = videos.concat();
        shuffle(clone);
        queue.shuffledVideos = clone;
        store.set('queue', queue);
        if (callback) callback(queue);
        break;
      }
      case 'remove': {
        const newVideos = videos.filter(video => video.id !== id);
        const newShuffledVideos = videos.filter(video => video.id !== id);
        queue.videos = newVideos;
        queue.shuffledVideos = newShuffledVideos;
        store.set('queue', queue);
        if (callback) callback(queue);
        break;
      }
      case 'shuffle': {
        shuffle(shuffledVideos);
        queue.shuffledVideos = shuffledVideos;
        store.set('queue', queue);
        if (callback) callback(queue);
        break;
      }
    }

    return true; // for async
  }
}

const shuffle = array => {
  for (let i = array.length - 1; i > 0; i--) {
    const r = Math.floor(Math.random() * (i + 1));
    const tmp = array[i];
    array[i] = array[r];
    array[r] = tmp;
  }
};
