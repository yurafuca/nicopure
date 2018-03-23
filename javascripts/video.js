class Video {
  constructor(video) {
    console.log(video);
    let item = video.item_data;

    this.playUrl = 'http://www.nicovideo.jp/watch/' + item.video_id;
    this.thumbnail = item.thumbnail_url;
    this.title = item.title;
    this.id = item.watch_id.slice(2);
    this.uploadTime = item.first_retrieve;
    this.playCount = item.view_counter;
    this.commentCount = item.num_res;
    this.subscribeCount = item.mylist_counter;
    this.favoriteTime = video.create_time;

    this.play_secTime = Math.floor(item.length_seconds % 60);
    this.play_minTime = Math.floor((item.length_seconds / 60) % 60);

    this.idType = item.video_id.slice(0, 2);
  }
}
