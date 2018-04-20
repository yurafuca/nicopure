import store from 'store';
import Api from './api';
import Modal from './modal';
import Toast from './toast';
import Video from './video';
import PlayerView from './playerview';
import Mylist from './mylist';
import Mylists from './mylists';
import Candidates from './candidates';
import Playlist from './playlist';

import { Store as QueueStore } from './queuestore';
import { Store as PlayerStore } from './playerstore';

const api = new Api();

window.onload = () => {
  // プレイヤ初期化
  PlayerView.init();
  PlayerView.listen();

  // 視聴履歴
  const history = new Mylist(null, { isHistory: true });
  Mylists.append(history);

  // とりあえずマイリスト
  const toriaezu = new Mylist(null, { isToriaezu: true });
  Mylists.append(toriaezu);

  // マイリスト
  api.mylistGroup.list().then(group => {
    group.forEach(mylist => {
      const instance = new Mylist(mylist);
      Mylists.append(instance);
    });
  });

  // プレイリスト
  QueueStore.dispatch({ op: 'current' }, queue => {
    const items = queue.videos;
    items.forEach(item => {
      const video = new Video(item, { isObject: true });
      Playlist.append(video);
    });
  });

  // ボリューム反映
  const slider = document.querySelector('.volume .volumebar input');
  const volume = store.get('player.state').volume;
  slider.value = volume;
};

const search = () => {
  const sortMode = document.querySelector('#search-sort').value;
  const query = document.querySelector('#search-query').value;
  Candidates.clear();
  api.web.search(query, sortMode).then(items => {
    Candidates.guide();
    items.forEach(item => {
      const video = new Video(item, { fromSearch: true });
      Candidates.append(video);
    });
  });
};

document.querySelector('#openintab').addEventListener('click', () => {
  chrome.tabs.create({ url: '../html/popup.html' });
});

document.querySelector('#search-sort').addEventListener('change', e => {
  search();
});

document.querySelector('#search-button').addEventListener('click', e => {
  search();
});

document.querySelector('#search-query').addEventListener('keydown', e => {
  if (event.key !== 'Enter') return;
  event.preventDefault();
  search();
});

// マイリスト作成
document.querySelector('.footer .new').addEventListener('click', () => {
  const onClickOk = e => {
    const title = e.querySelector('input').value;
    api.mylistGroup.add(title).then(() => {
      Mylists.clear();

      // 視聴履歴取得
      const history = new Mylist(null, { isHistory: true });
      Mylists.append(history);

      // とりあえずマイリスト取得
      const toriaezu = new Mylist(null, { isToriaezu: true });
      Mylists.append(toriaezu);

      api.mylistGroup.list().then(group => {
        group.forEach(mylist => {
          const instance = new Mylist(mylist);
          Mylists.append(instance);
        });
        const toast = new Toast('追加しました');
        toast.show();
      });
    });
  };

  new Modal({
    title: '作成するマイリストの名前を入力してください',
    innerHTML: `<input type="text" class="radius-left" placeholder="例: 作業用BGM">`,
    okText: '作成',
    calcelText: '作成せずに閉じる',
    onClickOk: onClickOk
  }).open();
});

// マイリスト削除
document.querySelector('.footer .remove').addEventListener('click', () => {
  api.mylistGroup.list().then(group => {
    const selectElement = document.createElement('select');
    const optionElements = group.map(mylist => {
      const { name, id } = mylist;
      const optionElement = document.createElement('option');
      optionElement.innerHTML = name;
      optionElement.value = id;
      return optionElement;
    });
    selectElement.innerHTML = optionElements.map(element => element.outerHTML).join('');

    // 削除
    const onClickOkConfirm = (e, groupId) => {
      api.mylistGroup.remove(groupId).then(() => {
        const toast = new Toast('削除しました');
        toast.show();

        Mylists.clear();

        // 視聴履歴取得
        const history = new Mylist(null, { isHistory: true });
        Mylists.append(history);

        // とりあえずマイリスト取得
        const toriaezu = new Mylist(null, { isToriaezu: true });
        Mylists.append(toriaezu);

        api.mylistGroup.list().then(group => {
          group.forEach(mylist => {
            const instance = new Mylist(mylist);
            Mylists.append(instance);
          });
        });
      });
    };

    // 確認
    const onClickOk = e => {
      const groupId = e.querySelector('select').value;
      new Modal({
        title: '本当に取り消しますか？',
        innerHTML: '<div>この作業は取り消せません</div>',
        okText: '削除',
        calcelText: '削除せずに閉じる',
        onClickOk: onClickOkConfirm,
        onClickOkArg: groupId
      }).open();
    };

    new Modal({
      title: '削除するマイリストを選択してください',
      innerHTML: selectElement.outerHTML,
      okText: '削除',
      calcelText: '削除せずに閉じる',
      onClickOk: onClickOk
    }).open();
  });
});

// すべて再生
document.querySelector('.footer .all').addEventListener('click', () => {
  const onClickOk = () => {
    [...document.querySelectorAll('#candidates .video')].forEach(e => {
      const video = new Video(e, { fromDom: true });

      QueueStore.dispatch(
        {
          op: 'add',
          video: video.object
        },
        () => Playlist.append(video)
      );
    });

    const toast = new Toast('プレイリストに登録しました');
    toast.show();
  };

  // 確認
  new Modal({
    title: 'プレイリストにすべて追加',
    innerHTML: '<div>プレイリストにすべて追加しますか？</div>',
    okText: '追加',
    calcelText: '追加せずに閉じる',
    onClickOk: onClickOk
  }).open();
});

// すべて削除
document.querySelector('.footer .clear').addEventListener('click', () => {
  const onClickOk = () => {
    [...document.querySelectorAll('#playlist .video')].forEach(e => {
      const video = new Video(e, { fromDom: true });

      QueueStore.dispatch({
        op: 'remove',
        id: video.object.id
      });
    });

    Playlist.clear();

    const toast = new Toast('プレイリストをクリアしました');
    toast.show();
  };

  // 確認
  new Modal({
    title: 'プレイリストからすべて削除',
    innerHTML: '<div>この作業は取り消せません</div>',
    okText: '削除',
    calcelText: '削除せずに閉じる',
    onClickOk: onClickOk
  }).open();
});

// ボリュームバー表示
document.querySelector('.volume').addEventListener('mouseenter', () => {
  const bar = document.querySelector('.volumebar');
  bar.classList.toggle('none');
});

// ボリュームバー非表示
document.querySelector('.volume').addEventListener('mouseleave', () => {
  const bar = document.querySelector('.volumebar');
  bar.classList.toggle('none');
});

// ボリューム調整
const slider = document.querySelector('.volume .volumebar input');
slider.addEventListener('input', () => {
  const amount = slider.value;
  chrome.runtime.sendMessage({ op: 'volume', amount: amount });
});
