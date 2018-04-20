import store from 'store';
import Api from './api';
import Modal from './modal';
import Toast from './toast';
import Candidates from './candidates';
import Playlist from './playlist';
import FrontPlayer from './frontplayer';
import { Store as QueueStore } from './queuestore';

const api = new Api();

export default class Video {
  constructor(data, options = {}) {
    this.tooltips = [];

    let object = null;
    const { isObject } = options;

    if (isObject) object = data;
    else object = this.toObject(data, options);

    this.element = this.toElement(object, options);
    this.object = object;
    this.setEvent(this.element);

    return this;
  }

  toObject(video, options) {
    const { mylistId, fromSearch, fromDom, fromHistory } = options;
    let result = null;

    if (fromSearch) result = this._toObjectFromSearch(video);
    else if (fromDom) result = this._toObjectFromDom(video);
    else if (fromHistory) result = this._toObjectFromHistory(video);
    else result = this._toObjectFromMylist(video.item_data);

    // マイリストから読み込んだ場合は mylistId を持つ
    result.mylistId = mylistId;

    return result;
  }

  _toObjectFromSearch(data) {
    const secDuration = data.lengthSeconds;
    const minDuration = Math.floor((data.lengthSeconds / 60) % 60);

    return {
      id: data.contentId,
      url: 'http://www.nicovideo.jp/watch/' + data.contentId,
      thumbnail: data.thumbnailUrl,
      title: data.title,
      playCount: data.viewCounter,
      commentCount: data.commentCounter,
      subscribeCount: data.mylistCounter,
      secDuration: secDuration,
      minDuration: Math.floor((secDuration / 60) % 60),
      duration: minDuration + ':' + ('0' + secDuration).slice(-2),
      rawDuration: data.lengthSeconds
    };
  }

  _toObjectFromDom(data) {
    const secDuration = data.querySelector('.raw_duration').textContent * 1;
    const minDuration = Math.floor((secDuration / 60) % 60);

    return {
      id: data.querySelector('.id').textContent,
      url: data.querySelector('.url').textContent,
      thumbnail: data
        .querySelector('.thumbnail')
        .style.backgroundImage.replace('url(" ', '')
        .replace(' ")', ''),
      title: data.querySelector('.title').textContent,
      playCount: data.querySelector('.viewCount').textContent,
      commentCount: data.querySelector('.commentCount').textContent,
      subscribeCount: data.querySelector('.subscribeCount').textContent,
      secDuration: secDuration,
      minDuration: minDuration,
      duration: minDuration + ':' + ('0' + secDuration).slice(-2),
      rawDuration: secDuration
    };
  }

  _toObjectFromHistory(data) {
    return {
      id: data.video_id,
      url: 'http://www.nicovideo.jp/watch/' + data.video_id,
      thumbnail: data.thumbnail_url,
      title: data.title,
      playCount: null,
      commentCount: null,
      subscribeCount: null,
      secDuration: null,
      minDuration: null,
      duration: data.length,
      rawDuration: null
    };
  }

  _toObjectFromMylist(data) {
    const secDuration = Math.floor(data.length_seconds % 60);
    const minDuration = Math.floor((data.length_seconds / 60) % 60);

    return {
      id: data.watch_id,
      url: 'http://www.nicovideo.jp/watch/' + data.video_id,
      thumbnail: data.thumbnail_url,
      title: data.title,
      playCount: Number(data.view_counter).toLocaleString(),
      commentCount: Number(data.num_res).toLocaleString(),
      subscribeCount: Number(data.mylist_counter).toLocaleString(),
      secDuration: secDuration,
      minDuration: minDuration,
      duration: minDuration + ':' + ('0' + secDuration).slice(-2),
      rawDuration: data.length_seconds
    };
  }

  toElement(object) {
    const {
      url,
      thumbnail,
      duration,
      title,
      playCount,
      commentCount,
      subscribeCount,
      id,
      rawDuration
    } = object;

    const doc = this.elem();

    doc.querySelector('.thumbnail').style.backgroundImage = `url(" ${thumbnail} ")`;
    doc.querySelector('.duration').textContent = duration;
    doc.querySelector('.title').textContent = title;
    doc.querySelector('.viewCount').textContent = playCount;
    doc.querySelector('.commentCount').textContent = commentCount;
    doc.querySelector('.subscribecount').textContent = subscribeCount;
    doc.querySelector('.id').textContent = id;
    doc.querySelector('.raw_duration').textContent = rawDuration;
    doc.querySelector('.url').textContent = url;

    [...doc.querySelectorAll('.button')].forEach(node => {
      // video を削除するとき tooltip を dispose するために video.tooltips に tooltip を保存する
      const tooltip = this.setTooltip(node, node.dataset.tooltipText, '#candidates');
      this.tooltips.push(tooltip);
    });

    return doc;
  }

  setTooltip(node, text, boundaries) {
    const modefier = data => {
      const tooltip = data.instance.popper;
      const top = parseInt(tooltip.style.top) || 0;
      tooltip.style.top = `${top - 3}px`;
    };

    return new Tooltip(node, {
      placement: 'top',
      title: text,
      container: document.querySelector('body'),
      popperOptions: {
        onCreate: modefier,
        onUpdate: modefier,
        modifiers: {
          flip: {
            enabled: false
          },
          preventOverflow: {
            boundariesElement: document.querySelector(boundaries)
          }
        }
      }
    });
  }

  setEvent(node) {
    this._src(node);
    this._addPlaylist(node);
    this._removePlaylist(node);
    this._addMylist(node);
    this._removeMylist(node);
    this._newTab(node);
  }

  _src(node) {
    node.addEventListener('click', () => {
      const object = this.object;

      api.video
        .fetch(object.id)
        .then(src => {
          FrontPlayer.src(src, object);
        })
        .catch(() => {
          const toast = new Toast('swf 形式の動画は再生できません');
          toast.show();
        });

      // 要素のインデクサを取得
      const videos = [...document.querySelectorAll('#playlist .video')];
      const nextCurrentId = videos.indexOf(node);

      // キューのインデックスを変更
      FrontPlayer.moveto(nextCurrentId);
    });
  }

  _addPlaylist(node) {
    node.querySelector('.buttons .addqueue').addEventListener('click', e => {
      e.stopPropagation();

      const clone = node.cloneNode(true);
      this.element = clone;
      this.setEvent(clone);

      const buttons = clone.querySelectorAll('.button');
      [...buttons].forEach(node => {
        node.classList.add('none');
        this.setTooltip(node, node.dataset.tooltipText, '#playlists');
      });

      QueueStore.dispatch(
        {
          op: 'add',
          video: this.object
        },
        res => {
          if (res.error === 'duplicate') {
            const toast = new Toast('すでにプレイリストに登録されています');
            toast.show();
          } else {
            Playlist.append(this);
          }
        }
      );
    });
  }

  _removePlaylist(node) {
    node.querySelector('.buttons .removequeue').addEventListener('click', e => {
      e.stopPropagation();

      // なぜか dispose で tooltip が消えないので手動で消す
      [...document.querySelectorAll('.tooltip')].forEach(tooltip => {
        tooltip.style.display = 'none';
      });

      QueueStore.dispatch({
        op: 'remove',
        id: this.object.id
      });

      Playlist.remove(node);
    });
  }

  _addMylist(node) {
    node.querySelector('.buttons .addmylist').addEventListener('click', e => {
      e.stopPropagation();

      api.mylistGroup.list().then(group => {
        const optionElements = group.map(mylist => {
          const optionElement = document.createElement('option');
          const { name, id } = mylist;

          optionElement.innerHTML = name;
          optionElement.value = id;

          return optionElement;
        });

        const selectElement = document.createElement('select');
        selectElement.innerHTML = optionElements.map(element => element.outerHTML).join('');

        // 追加
        const onClickOk = e => {
          const groupId = e.querySelector('select').value;
          const id = this.object.id;

          api.mylist.add(groupId, id).then(() => {
            const toast = new Toast('追加しました');
            toast.show();
          });
        };

        new Modal({
          title: '追加先のマイリストの名前を入力してください',
          innerHTML: selectElement.outerHTML,
          okText: '追加',
          calcelText: '追加せずに閉じる',
          onClickOk: onClickOk
        }).open();
      });
    });
  }

  _removeMylist(node) {
    node.querySelector('.buttons .removemylist').addEventListener('click', e => {
      e.stopPropagation();
      const lastGroupId = store.get('last.mylist');

      const reload = mylists => {
        new Toast('削除しました').show();

        Candidates.guide();

        mylists.forEach(mylist => {
          const video = new Video(mylist, { mylistId: lastGroupId });
          Candidates.append(video);
        });
      };

      const onClickOk = () => {
        const groupId = this.object.mylistId;
        const id = this.object.id;

        Candidates.clear();

        if (groupId !== 'toriaezu') {
          api.mylist.remove(groupId, id).then(() => {
            api.mylist.list().then(mylists => {
              reload(mylists);
            });
          });
        } else {
          api.toriaezu.remove(id).then(() => {
            api.toriaezu.list(lastGroupId).then(mylists => {
              reload(mylists);
            });
          });
        }
      };

      new Modal({
        title: '本当に削除しますか？',
        innerHTML: `<div>この作業は取り消せません</div>`,
        okText: '削除',
        calcelText: '削除せずに閉じる',
        onClickOk: onClickOk
      }).open();
    });
  }

  _newTab(node) {
    node.querySelector('.buttons .newtab').addEventListener('click', () => {
      chrome.tabs.create({ url: this.object.url });
    });
  }

  elem() {
    const parser = new DOMParser();
    const doc = parser
      .parseFromString(
        `
        <div class="video">
            <span>
            <div class="thumbnail_wrapper">
                <div class="thumbnail">
                    <div class="duration">0:00</div>
                </div>
            </div>
            </span>
            <div class="info">
                <div class="title">
                </div>
                <div class="count">
                <div class="upload_time"></div>
                <div class="counts">
                    <span class="viewCount"></span> ･
                    <span class="commentCount"></span> ･
                    <span class="subscribeCount"></span>
                </div>
                </div>
            </div>
            <div class="buttons">
                <div class="button addmylist none" data-tooltip-text="マイリストに追加"></div>
                <div class="button removemylist none" data-tooltip-text="マイリストから削除"></div>
                <div class="button newtab none" data-tooltip-text="新しいタブで開く"></div>
                <div class="button addqueue none" data-tooltip-text="プレイリストに追加"></div>
                <div class="button removequeue none" data-tooltip-text="プレイリストから削除"></div>                
            </div>
            <div class="badge">再生中</div>
            <div class="id none"></div>
            <div class="raw_duration none"></div>
            <div class="url none"></div>
        </div>
    `,
        'text/html'
      )
      .childNodes[0].querySelector('body').childNodes[0];

    return doc;
  }
}
