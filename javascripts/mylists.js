const _e = document.querySelector('#mylists .items');

export default class Mylists {
  static append(mylist) {
    _e.appendChild(mylist.element);
  }

  static clear() {
    _e.innerHTML = '';
  }
}
