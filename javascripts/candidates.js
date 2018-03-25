import store from 'store';

export default class Candidates {
  constructor(player, VideoClass, playlist) {
    this.element = document.querySelector('#candidates .items');
    this.player = player;
    this.video = new VideoClass();
    this.playlist = playlist;
  }

  parseNode(video, fromWebSearch) {
    const object = this.video.toObject(video, fromWebSearch);
    return object;
  }

  parseObject(object) {
    const node = this.video.toElement(object);
    return node;
  }

  append(node) {
    this.element.appendChild(node);
  }

  _setOnClick(node, object) {
    this.video._setOnClick(node, this.player);

    node.addEventListener('mouseleave', () => {
      node.querySelector('.buttons .addqueue').classList.toggle('none');
      node.querySelector('.buttons .newtab').classList.toggle('none');
      node.querySelector('.buttons .addmylist').classList.toggle('none');
      node.querySelector('.buttons .removemylist').classList.toggle('none');
    });

    node.addEventListener('mouseenter', () => {
      node.querySelector('.buttons .addqueue').classList.toggle('none');
      node.querySelector('.buttons .newtab').classList.toggle('none');
      node.querySelector('.buttons .addmylist').classList.toggle('none');
      node.querySelector('.buttons .removemylist').classList.toggle('none');
    });

    const queue = node.querySelector('.buttons .addqueue');
    queue.addEventListener('click', e => {
      e.stopPropagation();
      const clone = node.cloneNode(true);
      const buttons = clone.querySelectorAll('.button');
      [...buttons].forEach(node => {
        node.classList.add('none');
        this.video.setTooltip(node, node.dataset.tooltipText, '#playlists');
      });
      this.playlist._setOnClick(clone, object);
      this.playlist.append(clone);
      this.playlist.regist(object);
    });
  }

  clear() {
    this.element.innerHTML = '';
  }
}
