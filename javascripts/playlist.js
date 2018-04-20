const _e = document.querySelector('#playlist .items');

export default class Playlist {
  static append(video, tooltip) {
    const emptyMessage = _e.querySelector('.empty');

    if (emptyMessage) {
      emptyMessage.remove();
    }

    Playlist.setEvent(video, tooltip);
    _e.appendChild(video.element);
  }

  static remove(node) {
    node.remove();
  }

  static setEvent(video) {
    const node = video.element;

    node.querySelector('.buttons .addqueue').classList.add('none');
    node.querySelector('.buttons .removemylist').classList.add('none');

    node.addEventListener('mouseleave', () => {
      node.querySelector('.buttons .removequeue').classList.toggle('none');
      node.querySelector('.buttons .newtab').classList.toggle('none');
      node.querySelector('.buttons .addmylist').classList.toggle('none');
    });

    node.addEventListener('mouseenter', () => {
      node.querySelector('.buttons .removequeue').classList.toggle('none');
      node.querySelector('.buttons .newtab').classList.toggle('none');
      node.querySelector('.buttons .addmylist').classList.toggle('none');
    });
  }

  static clear() {
    _e.innerHTML =
      '<div class="empty">プレイリストは空です．<p class="small">丸い「+」ボタンをクリックするとプレイリストに追加できます．</p></div>';
  }
}
