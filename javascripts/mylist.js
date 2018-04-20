import store from 'store';
import Api from './api';
import Candidates from './candidates';
import Video from './video';

export default class Mylist {
  constructor(data, options = {}) {
    const { isToriaezu, isHistory } = options;
    let result = null;

    if (isToriaezu) result = this._toElementAsToriaezu();
    else if (isHistory) result = this._toElementAsHistory();
    else result = this.toElement(data);

    this.setEvent(result);
    this.element = result;

    return this;
  }

  elem() {
    const parser = new DOMParser();
    const node = parser
      .parseFromString(
        `
        <div class ="mylist">
          <span class="indicator folder"></span>
          <span class="name"></span>
          <span class="id"></span>
        </div>
    `,
        'text/html'
      )
      .childNodes[0].querySelector('body').childNodes[0];

    return node;
  }

  toElement(mylist) {
    const node = this.elem();
    node.querySelector('.name').textContent = mylist.name;
    node.querySelector('.id').textContent = mylist.id;
    return node;
  }

  _toElementAsToriaezu() {
    const node = this.elem();
    node.querySelector('.name').textContent = 'とりあえずマイリスト';
    node.querySelector('.id').textContent = 'toriaezu';
    node.classList.add('toriaezu');
    return node;
  }

  _toElementAsHistory() {
    const node = this.elem();
    node.querySelector('.name').textContent = '視聴履歴';
    node.querySelector('.id').textContent = 'history';
    node.classList.add('history');
    return node;
  }

  toriaezu() {
    const node = this.elem();
    return node;
  }

  setEvent(doc) {
    const api = new Api();
    const mylistId = doc.querySelector('.id').textContent;
    doc.addEventListener('click', () => {
      Candidates.clear();

      // とりあえずマイリスト
      if (mylistId === 'toriaezu') {
        api.toriaezu.list().then(mylists => {
          Candidates.guide();
          mylists.forEach(mylist => {
            const video = new Video(mylist, { mylistId: mylistId });
            Candidates.append(video);
          });
        });
        // 視聴履歴
      } else if (mylistId == 'history') {
        api.history.list().then(items => {
          Candidates.guide();
          items.forEach(item => {
            const video = new Video(item, { fromHistory: true });
            Candidates.append(video);
          });
        });
        // マイリスト
      } else {
        api.mylist.list(mylistId).then(mylists => {
          Candidates.guide();
          mylists.forEach(mylist => {
            const video = new Video(mylist, { mylistId: mylistId });
            Candidates.append(video);
          });
        });
      }
      store.set('last.mylist', mylistId);
    });
  }
}
