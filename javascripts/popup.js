import store from 'store';
import Api from './api';
import Videos from './videos';

import Frontplayer from './frontplayer';
import Contoller from './controller.js';

import Mylists from './mylists';
import Candidates from './candidates';
import Playlist from './playlist';

const api = new Api();

const player = new Frontplayer();

const mylists = new Mylists(player, Videos);
const playlist = new Playlist(player, Videos);
const candidates = new Candidates(player, Videos, playlist);

const modal = document.querySelector('.modal');
const modalText = modal.querySelector('.text');
const modalInput = modal.querySelector('input');

const list = playlist.currentList();
list.forEach(i => {
  const node = playlist.parseObject(i);
  playlist._setOnClick(node, i);
  playlist.append(node);
});

const toriaezu = mylists.toriaezu();
mylists._setOnClick(toriaezu, candidates);
mylists.append(toriaezu);

api.mylist.fetchGroup().then(group => {
  group.forEach(mylist => {
    const node = mylists.parseNode(mylist);
    mylists._setOnClick(node, candidates);
    mylists.append(node);
  });
});

// 名前をつけて保存
document.querySelector('.footer .save').addEventListener('click', () => {
  modalText.textContent = 'プレイリストの名前を入力してください';
  modal.classList.remove('none');
});

// 削除
document.querySelector('.footer .clear').addEventListener('click', () => {
  playlist.clear();
  playlist.destroy();
});

// 保存
document.querySelector('.modal .btn.save').addEventListener('click', () => {
  const title = modalInput.value;
  playlist.create(title);
  modal.classList.add('none');
});

// 閉じる
document.querySelector('.modal .btn.close').addEventListener('click', () => {
  modal.classList.add('none');
});

document.querySelector('.icon-wrapper.playlist').addEventListener('click', e => {
  document.querySelector('.icon-wrapper.mylist').classList.remove('none');
  e.currentTarget.classList.add('none');
  mylists.clear();
  const list = playlist.currentUserLists();
  Object.keys(list).forEach(key => {
    const node = mylists.elem();
    node.querySelector('.name').textContent = key;
    node.querySelector('.folder').classList.add('none');
    node.querySelector('.music').classList.remove('none');
    mylists._setOnClick(node, candidates, list[key]);
    mylists.append(node);
  });
});

document.querySelector('.icon-wrapper.mylist').addEventListener('click', e => {
  document.querySelector('.icon-wrapper.playlist').classList.remove('none');
  e.currentTarget.classList.add('none');
  mylists.clear();
  api.mylist.fetchGroup().then(group => {
    group.forEach(mylist => {
      const node = mylists.parseNode(mylist);
      mylists._setOnClick(node, candidates);
      mylists.append(node);
    });
  });
});

document.querySelector('#search-sort').addEventListener('change', e => {
  const sortMode = document.querySelector('#search-sort').value;
  const query = document.querySelector('#search-query').value;
  api.web.search(query, sortMode).then(items => {
    candidates.clear();
    items.forEach(item => {
      const object = candidates.parseNode(item, true);
      const node = candidates.parseObject(object);
      candidates._setOnClick(node, object);
      candidates.append(node);
    });
  });
});

document.querySelector('#search-button').addEventListener('change', e => {
  const sortMode = document.querySelector('#search-sort').value;
  const query = document.querySelector('#search-query').value;
  api.web.search(query, sortMode).then(items => {
    candidates.clear();
    items.forEach(item => {
      const object = candidates.parseNode(item, true);
      const node = candidates.parseObject(object);
      candidates._setOnClick(node, object);
      candidates.append(node);
    });
  });
});

document.querySelector('#search-query').addEventListener('keydown', e => {
  if (event.key !== 'Enter') {
    return;
  }

  event.preventDefault();

  const sortMode = document.querySelector('#search-sort').value;
  const query = document.querySelector('#search-query').value;
  api.web.search(query, sortMode).then(items => {
    candidates.clear();
    items.forEach(item => {
      const object = candidates.parseNode(item, true);
      const node = candidates.parseObject(object);
      candidates._setOnClick(node, object);
      candidates.append(node);
    });
  });
});
