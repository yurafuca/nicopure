import axios from 'axios';
import QueryString from './queryString';

export default class Api {
  constructor() {
    this.video = new NicoVideo();
    this.mylist = new NicoMylist();
    this.toriaezu = new NicoToriaezu();
    this.mylistGroup = new NicoMylistGroup();
    this.web = new Web();
  }

  token() {
    return axios
      .get(`http://www.nicovideo.jp/watch/sm9`)
      .then(res => {
        const data = res.data;
        const node = document.createElement('div');
        node.innerHTML = data;
        if (node.querySelector('#watchAPIDataContainer')) {
          const apiDataNode = node.querySelector('#watchAPIDataContainer');
          const apiData = JSON.parse(apiDataNode.textContent);
          const token = apiData.flashvars.csrfToken;
          return token;
        } else {
          const watchData = node.querySelector('#js-initial-watch-data');
          const apiData = JSON.parse(watchData.getAttribute('data-api-data'));
          const token = apiData.context.csrfToken;
          return token;
        }
      })
      .catch(err => {
        throw err;
      });
  }
}

/**
 * 動画
 */
class NicoVideo {
  constructor() {
    this.url = `http://www.nicovideo.jp/watch`;
  }

  fetch(id) {
    return axios
      .get(`${this.url}/${id}`)
      .then(res => {
        const data = res.data;
        const node = document.createElement('div');
        node.innerHTML = data;
        if (node.querySelector('#watchAPIDataContainer')) {
          const url = this._parseFlashPage(node);
          return url;
        } else {
          const url = this._parseHtml5Page(node);
          return url;
        }
      })
      .catch(err => {
        throw err;
      });
  }

  _parseFlashPage(node) {
    const apiDataNode = node.querySelector('#watchAPIDataContainer');
    const apiData = JSON.parse(apiDataNode.textContent);
    const flvInfo = apiData.flashvars.flvInfo;
    const params = {};
    decodeURIComponent(flvInfo)
      .split('&')
      .forEach(item => {
        const sp = item.split('=');
        const key = decodeURIComponent(sp[0]);
        const val = decodeURIComponent(sp.slice(1).join('='));
        params[key] = val;
      });
    const url = params.url;
    return url;
  }

  _parseHtml5Page(node) {
    const watchData = node.querySelector('#js-initial-watch-data');
    const apiData = JSON.parse(watchData.getAttribute('data-api-data'));
    const url = apiData.video.smileInfo.url;
    return url;
  }
}

/**
 * マイリスト
 */
class NicoMylist {
  constructor() {
    this.url = `http://www.nicovideo.jp/api/mylist/`;
  }

  list(id) {
    const req = axios.get(`${this.url}/list`, {
      params: {
        item_type: 0,
        group_id: id
      }
    });
    return req
      .then(res => {
        if (res.data.status === 'ok') {
          return Promise.resolve(res.data.mylistitem);
        } else {
          return new Error('Request failed:', req);
        }
      })
      .catch(err => {
        throw err;
      });
  }

  add(id) {
    return api.token().then(token => {
      const req = axios.get(`${this.url}/add`, {
        params: {
          item_type: 0,
          token: token,
          item_id: id
        }
      });
      return req
        .then(res => {
          if (res.data.status === 'ok') {
            return res;
          }
        })
        .catch(err => {
          throw err;
        });
    });
  }

  remove(id) {
    return api.token().then(token => {
      return api.toriaezu.search(id).then(item => {
        const params = [];
        params.push(`?item_type=0`);
        params.push(`&token=${token}`);
        params.push(`&id_list[0][]=${item.item_id}`);
        const req = axios.post(`${this.url}/delete${params.join('')}`);
        return req
          .then(res => {
            if (res.data.status === 'ok') {
              return true;
            }
          })
          .catch(err => {
            throw err;
          });
      });
    });
  }

  // 動画の id からマイリストの id を取得する
  search(id) {
    return api.toriaezu.list().then(list => {
      for (let i = 0; i < list.length; i++) {
        const item = list[i];
        if (item.item_data.watch_id == id) {
          return item;
        }
      }
      return Promise.reject();
    });
  }
}

class NicoToriaezu {
  constructor() {
    this.url = `http://www.nicovideo.jp/api/deflist`;
  }

  list() {
    const req = axios.get(`${this.url}/list`, {
      params: {
        item_type: 0
      }
    });
    return req
      .then(res => {
        if (res.data.status === 'ok') {
          return res.data.mylistitem;
        } else {
          return new Error('Request failed:', req);
        }
      })
      .catch(err => {
        throw err;
      });
  }

  add(id) {
    return api.token().then(token => {
      const req = axios.get(`${this.url}/add`, {
        params: {
          item_type: 0,
          token: token,
          item_id: id
        }
      });
      return req
        .then(res => {
          if (res.data.status === 'ok') {
            return true;
          }
        })
        .catch(err => {
          throw err;
        });
    });
  }

  remove(id) {
    return api.token().then(token => {
      return api.toriaezu.search(id).then(item => {
        const params = [];
        params.push(`?item_type=0`);
        params.push(`&token=${token}`);
        params.push(`&id_list[0][]=${item.item_id}`);
        const req = axios.post(`${this.url}/delete${params.join('')}`);
        return req
          .then(res => {
            if (res.data.status === 'ok') {
              return true;
            }
          })
          .catch(err => {
            throw err;
          });
      });
    });
  }

  // 動画の id からマイリストの id を取得する
  search(id) {
    return api.toriaezu.list().then(list => {
      for (let i = 0; i < list.length; i++) {
        const item = list[i];
        if (item.item_data.watch_id == id) {
          return item;
        }
      }
      return Promise.reject();
    });
  }
}

class NicoMylistGroup {
  constructor() {
    this.url = `http://www.nicovideo.jp/api/mylistgroup/list`;
  }

  list() {
    const req = axios.get(this.url);
    return req
      .then(res => {
        if (res.data.status === 'ok') {
          return res.data.mylistgroup;
        } else {
          return new Error('Request failed:', req);
        }
      })
      .catch(err => {
        throw err;
      });
  }
}

/**
 *  検索
 */
class Web {
  constructor() {
    this.url = 'http://api.search.nicovideo.jp/api/v2/video/contents/search';
    // - => 昇順
    // + => 降順
    // lastCommentTime 以外はデフォルトで降順
    this.sortModes = {
      mylistCounter: '-mylistCounter',
      mylistCounterInv: '+mylistCounter',
      viewCounter: '-viewCounter',
      viewCounterInv: '+viewCounter',
      commentCounter: '-commentCounter',
      commentCounterInv: '+commentCounter',
      lastCommentTime: '+lastCommentTime',
      lastCommentTimeInv: '-lastCommentTime',
      lengthSeconds: '-lengthSeconds',
      lengthSecondsInv: '+lengthSeconds'
    };
  }

  search(query, sort) {
    const req = axios.get(this.url, {
      params: {
        targets: 'tags,title,description',
        fields:
          'contentId,thumbnailUrl,title,viewCounter,commentCounter,mylistCounter,lengthSeconds',
        _sort: this.sortModes[sort],
        _limit: 100,
        q: query
      }
    });
    return req
      .then(res => {
        if (res.data.meta.status == 200) {
          return res.data.data;
        } else {
          return new Error('Request failed:', req);
        }
      })
      .catch(err => {
        throw err;
      });
  }
}

const api = new Api();

// class Token {

// }
