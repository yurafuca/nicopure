import axios from 'axios';
import QueryString from './queryString';

export default class Api {
  constructor() {
    this.video = new NicoVideo();
    this.mylist = new NicoMylist();
    this.web = new Web();
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
    this.groupUrl = `http://www.nicovideo.jp/api/mylistgroup/list`;
    this.mylistUrl = `http://www.nicovideo.jp/api/mylist/list`;
    this.toriaezuUrl = `http://www.nicovideo.jp/api/deflist/list`;
  }

  fetchGroup() {
    const req = axios.get(this.groupUrl);
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

  fetchMylist(id) {
    const req = axios.get(this.mylistUrl, {
      params: {
        group_id: id
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

  fetchToriaezu() {
    const req = axios.get(this.toriaezuUrl);
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
