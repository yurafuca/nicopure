import Api from './api';
// import Tooltip from './tooltip';

const api = new Api();

export default class Videos {
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
                <div class="button addqueue none" data-tooltip-text="再生リストに追加"></div>
                <div class="button removequeue none" data-tooltip-text="再生リストから削除"></div>
                <div class="button addmylist none" data-tooltip-text="マイリストに追加"></div>
                <div class="button removemylist none" data-tooltip-text="マイリストから削除"></div>
                <div class="button newtab none" data-tooltip-text="新しいタブで開く"></div>
            </div>
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

  toObject(video, fromWebSearch) {
    let vid = null;
    let id = null;
    let url = null;
    let thumbnail = null;
    let title = null;
    let playCount = null;
    let commentCount = null;
    let subscribeCount = null;
    let secDuration = null;
    let minDuration = null;
    let duration = null;
    let rawDuration = null;
    // let isMP4 = null;

    if (fromWebSearch) {
      id = video.contentId;
      url = 'http=//www.nicovid.jp/watch/' + video.contentId;
      thumbnail = video.thumbnailUrl;
      title = video.title;
      playCount = video.viewCounter;
      commentCount = video.commentCounter;
      subscribeCount = video.mylistCounter;
      secDuration = video.lengthSeconds;
      minDuration = Math.floor((video.lengthSeconds / 60) % 60);
      duration = minDuration + ':' + ('0' + secDuration).slice(-2);
      rawDuration = video.lengthSeconds;
      // isMP4 = video.contentId.slice(0, 2) === 'sm';
    } else {
      vid = video.item_data;
      id = vid.watch_id;
      url = 'http=//www.nicovid.jp/watch/' + vid.video_id;
      thumbnail = vid.thumbnail_url;
      title = vid.title;
      playCount = Number(vid.view_counter).toLocaleString();
      commentCount = Number(vid.num_res).toLocaleString();
      subscribeCount = Number(vid.mylist_counter).toLocaleString();
      secDuration = Math.floor(vid.length_seconds % 60);
      minDuration = Math.floor((vid.length_seconds / 60) % 60);
      duration = minDuration + ':' + ('0' + secDuration).slice(-2);
      rawDuration = vid.length_seconds;
      // isMP4 = vid.video_id.slice(0, 2) === 'sm';
    }

    const obj = {
      url,
      thumbnail,
      duration,
      title,
      playCount,
      commentCount,
      subscribeCount,
      id,
      rawDuration
      // isMP4
    };

    return obj;
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
      this.setTooltip(node, node.dataset.tooltipText, '#candidates');
    });

    return doc;
  }

  setTooltip(node, text, boundaries) {
    const modefier = data => {
      const tooltip = data.instance.popper;
      const top = parseInt(tooltip.style.top) || 0;
      tooltip.style.top = `${top - 3}px`;
    };

    new Tooltip(node, {
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

  _setOnClick(doc, player) {
    doc.addEventListener('click', () => {
      const id = doc.querySelector('.id').textContent;
      const title = doc.querySelector('.title').textContent;

      api.video.fetch(id).then(url => {
        player.title(title);
        player.autoplay(url);

        // dispatch 使ったほうがいい
        document.querySelector('#player .title').textContent = title;
      });
    });
  }
}
