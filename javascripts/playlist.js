import store from 'store';

export default class Playlist {
  constructor(player, VideoClass) {
    this.element = document.querySelector('#playlist .items');
    this.player = player;
    this.video = new VideoClass();

    if (store.get('last.playlist.type') == null) {
      store.get('last.playlist.type', 'SYSTEM');
    }
  }

  parseNode(video) {
    const object = this.video.toObject(video);
    return object;
  }

  parseObject(object) {
    const node = this.video.toElement(object);
    return node;
  }

  currentList() {
    const currentUserLists = this.currentUserLists();
    const currentListType = this.currentListType();
    if (currentListType === 'USER') {
      const name = this.currentListName();
      return currentUserLists[name] || [];
    } else if (currentListType === 'SYSTEM') {
      return store.get('playlists.system') || [];
    }
  }

  currentUserLists() {
    return store.get('playlists') || {};
  }

  currentListName() {
    return store.get('last.playlist.name');
  }

  currentListType() {
    return store.get('last.playlist.type');
  }

  setListName(name) {
    store.set('last.playlist.name', name);
  }

  setListType(type) {
    store.set('last.playlist.type', type);
  }

  // DOM に登録
  append(node) {
    this.element.appendChild(node);
  }

  // DOM から削除
  remove(node) {
    node.remove();
  }

  // localStorage に登録
  regist(object) {
    const currentList = this.currentList();
    currentList.push(object);
    this.save(currentList);
  }

  // localStorage から削除
  delete(object) {
    const { id } = object;
    const currentList = this.currentList();
    const newList = currentList.filter(item => item.id !== id);
    this.save(newList);
  }

  // localStorage にプレイリストを名前をつけて保存
  create(name) {
    const currentList = this.currentList();
    const currentUserLists = this.currentUserLists();
    currentUserLists[name] = currentList;
    store.set('playlists', currentUserLists);
    this.setListName(name);
    this.setListType('USER');
  }

  // localStorage にプレイリストを上書き保存
  save(list) {
    const currentListType = this.currentListType();
    if (currentListType === 'USER') {
      const currentUserLists = this.currentUserLists();
      const currentListName = this.currentListName();
      currentUserLists[currentListName] = list;
      store.set('playlists', currentUserLists);
    } else if (currentListType === 'SYSTEM') {
      store.set('playlists.system', list);
    }
  }

  // localStorage からプレイリストを削除
  destroy() {
    this.save([]);
    this.setListName(null);
    this.setListType('SYSTEM');
  }

  _setOnClick(node, object) {
    this.video._setOnClick(node, this.player);

    node.querySelector('.buttons .addqueue').classList.add('none');

    node.addEventListener('mouseleave', () => {
      node.querySelector('.buttons .removequeue').classList.toggle('none');
      node.querySelector('.buttons .newtab').classList.toggle('none');
      node.querySelector('.buttons .addmylist').classList.toggle('none');
      node.querySelector('.buttons .removemylist').classList.toggle('none');
    });

    node.addEventListener('mouseenter', () => {
      node.querySelector('.buttons .removequeue').classList.toggle('none');
      node.querySelector('.buttons .newtab').classList.toggle('none');
      node.querySelector('.buttons .addmylist').classList.toggle('none');
      node.querySelector('.buttons .removemylist').classList.toggle('none');
    });

    const queue = node.querySelector('.buttons .removequeue');
    queue.addEventListener('click', e => {
      e.stopPropagation();
      this.delete(object);
      this.remove(node);
    });
  }

  clear() {
    this.element.innerHTML = '';
  }
}
