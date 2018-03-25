import store from 'store';
import Api from './api';

export default class Mylists {
  constructor(player, VideoClass) {
    this.element = document.querySelector('#mylists .items');
    this.player = player;
    this.video = new VideoClass();
  }

  elem() {
    const parser = new DOMParser();
    const node = parser
      .parseFromString(
        `
        <div class ="mylist">
          <span class="indicator folder"></span>
          <span class="indicator music none"></span>
          <span class="name"></span>
          <span class="id"></span>
        </div>
    `,
        'text/html'
      )
      .childNodes[0].querySelector('body').childNodes[0];

    return node;
  }

  parseNode(mylist) {
    const node = this.elem();
    node.querySelector('.name').textContent = mylist.name;
    node.querySelector('.id').textContent = mylist.id;

    return node;
  }

  toriaezu() {
    const node = this.elem();
    node.querySelector('.name').textContent = 'とりあえずマイリスト';
    node.querySelector('.id').textContent = 'toriaezu';

    return node;
  }

  append(doc) {
    this.element.appendChild(doc);
  }

  clear() {
    this.element.innerHTML = '';
  }

  _setOnClick(doc, candidates, object) {
    const api = new Api();
    const id = doc.querySelector('.id').textContent;
    doc.addEventListener('click', e => {
      candidates.clear();

      if (doc.querySelector('.folder.none')) {
        // プレイリスト
        const name = doc.querySelector('.name').textContent;
        const list = store.get('playlists');
        list[name].forEach(e => {
          const node = candidates.parseObject(e);
          candidates._setOnClick(node, object);
          candidates.append(node);
        });
      } else {
        // マイリスト
        let fetch = null;
        if (id === 'toriaezu') {
          fetch = api.toriaezu.list();
        } else {
          fetch = api.mylist.list(id);
        }

        fetch.then(mylists => {
          mylists.forEach(mylist => {
            const object = candidates.parseNode(mylist);
            const doc = candidates.parseObject(object);
            candidates._setOnClick(doc, object);
            candidates.append(doc);
          });
        });
        store.set('last.mylist', id);
      }
    });
  }
}
