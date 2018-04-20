const _e = document.querySelector('#candidates .items');

export default class Candidates {
  static append(video) {
    const emptyMessage = _e.querySelector('.empty');

    if (emptyMessage) {
      emptyMessage.remove();
    }

    _e.appendChild(video.element);
    Candidates.setEvent(video);
  }

  static setEvent(video) {
    const node = video.element;
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
  }

  static clear() {
    _e.innerHTML = '';
  }

  static guide() {
    _e.innerHTML =
      '<div class="empty">アイテムがありません．<p class="small">マイリストを選択するか動画を検索してください．</p></div>';
  }
}
